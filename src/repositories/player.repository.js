const { Player } = require('../models');

function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

function countBySession(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

function create(data) {
  return Player.create(data);
}

function markSeen(player) {
  return player.update({ last_seen_at: new Date() });
}

function listBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    attributes: ['player_id', 'nickname', 'score', 'color'],
    order: [['score', 'DESC']],
  });
}

module.exports = { findSeat, countBySession, create, markSeen, listBySession };