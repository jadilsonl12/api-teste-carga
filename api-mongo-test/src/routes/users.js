const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/"),
  async (req, res) => {
    try {
      const { search } = req.query;
      const users = await User.find({
        $or: [
          { _id: new RegExp(search, "i") },
          { nome: new RegExp(search, "i") },
        ],
      });
      res.json(users);
    } catch (error) {
      res.status(500).json(err);
    }
  };

module.exports = router;
