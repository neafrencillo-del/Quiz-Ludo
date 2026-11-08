const sessionRepository = require('../repositories/session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) throw notFound('SESSION_NOT_FOUND', `No session found with code ${code}.`);
  return session;
}

async function create(setId, user) {
  const questionSet = await questionSetRepository.findById(setId);
  if (!questionSet) throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${setId}.`);

  const mayUse = questionSet.host_id === user.user_id || questionSet.is_public || user.role === 'ADMIN';
  if (!mayUse) throw forbidden('This question set belongs to another host.');

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      return await sessionRepository.create({
        set_id: questionSet.set_id,
        host_id: user.user_id,
        join_pin: randomCode(),
        status: 'LOBBY',
      });
    } catch (error) {
      if (error.name !== 'SequelizeUniqueConstraintError') throw error;
    }
  }
  throw new Error('Could not generate a unique join code after 5 attempts.');
}

async function get(code) {
  return findOrFail(code);
}

const NEXT_STATUS = {
  LOBBY: ['RUNNING', 'CLOSED'],
  RUNNING: ['CLOSED'],
  CLOSED: [],
};

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (session.host_id !== user.user_id && user.role !== 'ADMIN') {
    throw forbidden('This game belongs to another host.');
  }

  if (!NEXT_STATUS[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
  }

  const changes = { status };
  if (status === 'RUNNING') changes.started_at = new Date();
  if (status === 'CLOSED') changes.ended_at = new Date();

  return sessionRepository.update(session, changes);
}

module.exports = { findOrFail, create, get, changeStatus };