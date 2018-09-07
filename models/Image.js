let mongoose = require('mongoose');

let ImageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  path: { type: String, required: true },
  pathThumbnail: { type: String, required: true },
  label: [{ type: String }],
  scope: { type: String }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Image', ImageSchema);