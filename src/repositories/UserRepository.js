const { EntityRepository, getRepository } = require('typeorm');
const User = require('../entities/User');

class UserRepository extends EntityRepository {
  async createUser(email, password) {
    const user = new User();
    user.email = email;
    user.password = password;
    await this.save(user);
    return user;
  }

  async findUserByEmail(email) {
    return this.findOne({ email });
  }

  async findUserById(id) {
    return this.findOne(id, { relations: ['todos'] });
  }
}

module.exports = UserRepository;
