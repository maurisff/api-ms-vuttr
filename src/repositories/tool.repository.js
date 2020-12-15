const mongoose = require('mongoose');

const Model = mongoose.model('Tool');

exports.create = async (data) => new Model(data).save();

exports.delete = async (id) => Model.remove({ _id: id });

exports.findAll = async () => Model.find({});

exports.find = async (filter) => Model.find(filter);
