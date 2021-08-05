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

exports.read_a_score = function(req, res) {};

exports.read_users = function(req, res) {};
