const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferencias: { type: String },
});

module.exports = mongoose.model('User', userSchema);
