"use strict";

let model = require("../models/pokerModel");

exports.create_a_hand = function(req, res) {
  let new_hand = model.newHand(req.query.userId);
  res.json(new_hand);
};

exports.create_a_user = function(req, res) {
  let new_user = model.newUser(req.query.name);
  res.json(new_user);
};

exports.read_high_score = function(req, res) {
  let winner = model.getHighScore(req.query.users || []);
  res.json(winner);
};

exports.read_users = function(req, res) {
  let users = model.getUsers();
  res.json(users);
};
