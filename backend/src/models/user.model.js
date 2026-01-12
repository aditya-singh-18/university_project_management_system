const BaseModel = require('./base.model');

class UserModel extends BaseModel {
  static findByEmail(email) {
    return this.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
  }
}

module.exports = UserModel;
