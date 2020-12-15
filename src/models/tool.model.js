const mongoose = require('mongoose');

const { Schema } = mongoose;

const ColletionSchema = new Schema({
  title: {
    type: String,
    required: 'title is required',
  },
  link: {
    type: String,
    required: 'link is required',
  },
  description: {
    type: String,
    required: 'description is required',
  },
  tags: {
    type: [String],
  },
});
ColletionSchema.index({
  title: 'text', link: 'text', description: 'text', tags: 'text',
});
ColletionSchema.index({ tags: 1 });
module.exports = mongoose.model('Tool', ColletionSchema);
