const MD5 = require('md5');
const repository = require('../repositories/user.repository');

/**
 * Creat default user Credentials
 */
exports.createDefaultUser = async () => {
  try {
    const login = 'admin';
    const password = '123456';
    const name = 'Administrator';
    const defaultUser = await repository.findByLogin(login);
    if (!defaultUser) {
      await repository.create({ login, password: MD5(password), name });
      console.log(`Created default User (${name}) with login (${login}) and password (${password})`);
    }
  } catch (error) {
    console.error('createDefaultUser - Error: ', error);
  }
};
