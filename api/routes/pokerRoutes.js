'use strict';
module.exports = function(app) {
  var controller = require('../controllers/pokerController');

  // poker Routes
  app.route('/hands')
    .post(controller.create_a_hand);


  app.route('/score')
    .get(controller.read_high_score);

  app.route('/users')
    .get(controller.read_users)
    .post(controller.create_a_user);
};
