const mongoose = require('mongoose');

const { Schema } = mongoose;

const ColletionSchema = new Schema({
  login: {
    type: String,
    required: 'login is required',
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: 'password is required',
  },
  name: {
    type: String,
    required: 'name is required',
  },
});
ColletionSchema.index({ login: 'text', name: 'text' });
ColletionSchema.index({ login: 1 }, { unique: true });
module.exports = mongoose.model('User', ColletionSchema);
