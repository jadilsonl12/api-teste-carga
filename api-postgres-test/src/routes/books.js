const express = require('express');
const pool = require('../models/db');
const redisClient = require('../models/redis');
const router = express.Router();

router.post('/', async (req, res) => {
  const { titulo, autor, genero, descricao } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Livros (titulo, autor, genero, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, autor, genero, descricao]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  const { search } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM Livros WHERE titulo ILIKE $1 OR genero ILIKE $1',
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/top-rated', async (req, res) => {
  try {
    console.time('Tempo para verificar se já está no cache');
    const cache = await redisClient.get('books:top-rated');
    console.timeEnd('Tempo para verificar se já está no cache');
    
    if (cache) {
      console.log('Já está cache');
      return res.json(JSON.parse(cache));
    }

    console.log('Não está em cache');
    console.time('Tempo para realizar a consulta no banco');
    const result = await pool.query(`
      SELECT l.id, l.titulo, l.autor, AVG(a.nota) AS media_avaliacao
      FROM Livros l
      JOIN Avaliacoes a ON l.id = a.livro_id
      GROUP BY l.id
      ORDER BY media_avaliacao DESC
      LIMIT 10
    `);
    console.timeEnd('Tempo para realizar a consulta no banco');

    const topRatedBooks = result.rows;

    console.time('Tempo para trazer os dados em cache no redis');
    await redisClient.set('books:top-rated', JSON.stringify(topRatedBooks), {
      EX: 3600, 
    });
    console.timeEnd('Tempo para trazer os dados em cache no redis');

    res.json(topRatedBooks);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
