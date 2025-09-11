const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  wallet: String,
  text: String,
  summary: String,
  emergency: Boolean,
  emergencyMsg: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);