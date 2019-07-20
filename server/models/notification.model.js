const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: String,
  description: String,
  start: Date,
  end: Date,
  institution: [String]
}, {
  versionKey: false,
  collection: 'Notification'
});


module.exports = mongoose.model('Notification', notificationSchema);
