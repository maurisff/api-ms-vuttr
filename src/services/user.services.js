const MD5 = require('md5');
const repository = require('../repositories/user.repository');

/**
 * Method to validate already registered user
 * @param {string} login
 */
exports.validateUser = async (login) => {
  const data = await repository.findByLogin(String(login).toLowerCase());
  if (data) {
    throw new Error('login already exists');
  }
};

/**
 * User and password validation method
 * @param {string} login
 * @param {string} password
 * @return {Object<User>} user
 */
exports.validateUserPassword = async (login, password) => {
  const data = await repository.findByLogin(String(login).toLowerCase());
  if (!data || (data.password !== MD5(password))) {
    throw new Error('Invalid credentials');
  }
  return {
    _id: data._id,
    login: data.login,
    name: data.name,
  };
};
