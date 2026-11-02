'use strict';

async function findFinishedGamePlayers(db) {
  const sql = `
    SELECT 
      s.join_pin AS session_code, 
      s.started_at, 
      s.ended_at,
      u.school_id, 
      p.nickname, 
      p.score,
      (p.status = 'COMPLETED') AS completed
    FROM game_sessions s
    JOIN players p ON p.session_id = s.session_id
    JOIN users u ON u.user_id = p.user_id
    WHERE s.status = 'CLOSED';
  `;

  const results = await db.query(sql, { type: db.QueryTypes.SELECT });
  return results;
}

module.exports = {
  findFinishedGamePlayers,
};