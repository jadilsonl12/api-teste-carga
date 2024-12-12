const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livro_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  nota: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String },
});

module.exports = mongoose.model('Review', reviewSchema);
