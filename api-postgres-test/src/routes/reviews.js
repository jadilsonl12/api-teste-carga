const express = require('express');
const pool = require('../models/db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { usuario_id, livro_id, nota, comentario } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Avaliacoes (usuario_id, livro_id, nota, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
      [usuario_id, livro_id, nota, comentario]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Avaliacoes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
