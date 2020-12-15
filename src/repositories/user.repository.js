const mongoose = require('mongoose');

const Model = mongoose.model('User');

exports.create = async (data) => new Model(data).save();

exports.findAll = async () => Model.find({}).select('login name _id');

exports.find = async (filter) => Model.find(filter).select('login name _id');

exports.findByLogin = async (login) => Model.findOne({ login });
