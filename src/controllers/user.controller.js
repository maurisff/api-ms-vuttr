const MD5 = require('md5');
const repository = require('../repositories/user.repository');
const service = require('../services/user.services');
const Base64 = require('../util/Base64');
const authProvider = require('../middleware/authProvider');

/**
 * New User creation method
 * @param {Request} req
 * @param {Response} res
 */
exports.create = async (req, res) => {
  try {
    const { login, password, name } = req.body;

    await service.validateUser(login);

    const data = await repository.create({ login, password: MD5(password), name });

    res.status(201).json({ _id: data._id, login: data.login, name: data.name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * User authentication method
 * @param {Request} req
 * @param {Response} res
 */
exports.authentication = async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ error: 'Missing Authorization Header' });
    }

    const credentials = authorization.replace('Basic ', '');

    const [login, password] = Base64.decode(credentials).split(':');

    const user = await service.validateUserPassword(login, password);

    const token = await authProvider.createSecurity(user);
    res.header('authorization', token);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

/**
 * User search method
 * @param {Request} req
 * @param {Response} res
 */
exports.find = async (req, res) => {
  try {
    const { q } = req.query;
    let data = [];
    if (q) {
      data = await repository.find({ $text: { $search: q } });
    } else {
      data = await repository.findAll();
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
