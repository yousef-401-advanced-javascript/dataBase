'use strict';
const { Schema, model } = require('mongoose');

const Todo = new Schema({
  text: { type: String },
  assignee: { type: String },
  difficulty: { type: Number, default: 1 },
  complete: { type: Boolean, default: false },
  due:{type: String},
});

module.exports = model('todo', Todo);