import pool from '../config/db.js';

export const findUserByIdentifier = async (identifier) => {
  const query = `
    SELECT *
    FROM users
    WHERE user_key = $1 OR email = $1
    LIMIT 1
  `;
  const result = await pool.query(query, [identifier]);
  return result.rows[0];
};
