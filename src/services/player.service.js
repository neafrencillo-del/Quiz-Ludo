const playerRepository = require('../repositories/player.repository');
const sessionService = require('./session.service');
const { conflict } = require('../errors/app-error');

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) {
    await playerRepository.markSeen(seat);
    return { session, player: seat, created: false };
  }

  if (session.status === 'CLOSED') throw conflict('SESSION_ENDED', 'This game has ended.');
  if (session.status !== 'LOBBY') throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');

  const seatsTaken = await playerRepository.countBySession(session.session_id);
  if (seatsTaken >= (session.max_players || 4)) throw conflict('SESSION_FULL', 'This game is full.');

  try {
    const player = await playerRepository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
      last_seen_at: new Date(),
    });
    return { session, player, created: true };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const existing = await playerRepository.findSeat(session.session_id, user.user_id);
      if (existing) return { session, player: existing, created: false };
    }
    throw error;
  }
}

async function list(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.listBySession(session.session_id);
}

module.exports = { join, list };