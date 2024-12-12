const express = require("express");
const Book = require("../models/book");
const redisClient = require("../models/redis");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const books = await Book.find({
      $or: [
        { titulo: new RegExp(search, "i") },
        { genero: new RegExp(search, "i") },
      ],
    });
    res.json(books);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/top-rated", async (req, res) => {
  try {
    const cacheKey = "books:top-rated";

    console.time("Tempo para verificar se já está no cache");
    const cachedTopBooks = await redisClient.get(cacheKey);
    console.timeEnd("Tempo para verificar se já está no cache");

    if (cachedTopBooks) {
      console.log("Já está cache");
      return res.json(JSON.parse(cachedTopBooks));
    }

    console.log("Não está em cache");

    console.time("Tempo para realizar a consulta no banco");
    const topBooks = await Book.find();
    console.timeEnd("Tempo para realizar a consulta no banco");

    console.time("Tempo para trazer os dados em cache no redis");
    await redisClient.set("books:top-rated", JSON.stringify(topBooks), {
      EX: 3600,
    });
    console.timeEnd("Tempo para trazer os dados em cache no redis");

    res.json(topBooks);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
