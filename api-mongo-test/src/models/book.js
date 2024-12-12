const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  genero: { type: String, required: true },
  descricao: { type: String },
});

module.exports = mongoose.model('Book', bookSchema);
