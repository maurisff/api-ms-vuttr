const { verify, sign } = require('jsonwebtoken');
const { jwt } = require('../config/auth');

const noAuthPaths = ['session/authentication'];
module.exports = {
  verifySecurity: async (req, res, next) => {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    if (noAuthPaths.findIndex((f) => req.path.match(f)) > -1) {
      return next();
    }

    const { authorization } = req.headers;

    if (!authorization || authorization.indexOf('Bearer ') === -1) {
      return res.status(401).json({ error: 'Missing Authorization Header' });
    }

    const tokenJWT = authorization.replace('Bearer ', '');

    if (!tokenJWT) {
      return res.status(401).json({ error: 'JWT token is missing' });
    }

    try {
      const tokenPayload = verify(tokenJWT, jwt.secret);
      const { user } = tokenPayload;
      if (user) {
        const { _id } = user;
        req.userId = _id;
      }
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  },
  createSecurity: async (user) => {
    try {
      const { _id, login, name } = user;
      const payload = {
        user: {
          _id,
          login,
          name,
        },
        createdAt: new Date().toJSON(),
      };
      return sign(payload, jwt.secret);
    } catch (error) {
      throw new Error('Error created token Security.');
    }
  },
};
