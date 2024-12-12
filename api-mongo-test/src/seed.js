require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Book = require('./models/book');
const Review = require('./models/review');

if (!process.env.MONGODB_URI) {
  console.error('A variável MONGODB_URI não está definida no arquivo .env.');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.time('Tempo de inserção dos dados');

    const users = Array.from({ length: 100000 }, (_, i) => ({
      nome: `User${i}`,
      email: `user${i}@example.com`,
      preferencias: 'Preferences example',
    }));
    console.log('Inserindo usuários...');
    const insertedUsers = await User.insertMany(users);

    const books = Array.from({ length: 100000 }, (_, i) => ({
      titulo: `Livro ${i}`,
      autor: `Autor ${i}`,
      genero: ['Ficção', 'Não-ficção', 'Aventura', 'Romance'][i % 4],
      descricao: `Descrição do livro ${i}`,
    }));
    console.log('Inserindo livros...');
    const insertedBooks = await Book.insertMany(books);

    const reviews = Array.from({ length: 500000 }, () => ({
      usuario_id: insertedUsers[Math.floor(Math.random() * insertedUsers.length)]._id,
      livro_id: insertedBooks[Math.floor(Math.random() * insertedBooks.length)]._id,
      nota: Math.floor(Math.random() * 5) + 1,
      comentario: `Comentário aleatório ${Math.random().toString(36).substring(7)}`,
    }));
    console.log('Inserindo avaliações...');
    await Review.insertMany(reviews);

    console.timeEnd('Tempo de inserção dos dados');

    console.time('Tempo para realizar busca dos dados');
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    const reviewCount = await Review.countDocuments();
    console.timeEnd('Tempo para realizar busca dos dados');

    console.log(`Total de usuários: ${userCount}`);
    console.log(`Total de livros: ${bookCount}`);
    console.log(`Total de avaliações: ${reviewCount}`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
