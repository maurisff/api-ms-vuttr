const controller = require('../controllers/tool.controller');

module.exports = (app) => {
  app.route('/tools')
    .get(controller.find)
    .post(controller.create);

  app.route('/tools/:id')
    .delete(controller.delete);
};
