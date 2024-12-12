const express = require('express');
const pool = require('../models/db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { nome, email, preferencias } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Usuarios (nome, email, preferencias) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, preferencias]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
