const pool = require('../config/db');

class BaseModel {
  static async query(sql, params = []) {
    const { rows } = await pool.query(sql, params);
    return rows;
  }
}

module.exports = BaseModel;
