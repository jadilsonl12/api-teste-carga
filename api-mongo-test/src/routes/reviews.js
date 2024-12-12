const express = require('express');
const Review = require('../models/review');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json(review);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('usuario_id livro_id');
    res.json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
