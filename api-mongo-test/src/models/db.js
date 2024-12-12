require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB conectado com suecesso");
  } catch (err) {
    console.error("Falha ao conectar no MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
