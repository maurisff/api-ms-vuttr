const controller = require('../controllers/user.controller');

module.exports = (app) => {
  app.route('/user')
    .get(controller.find)
    .post(controller.create);

  app.route('/session/authentication')
    .post(controller.authentication);
};
