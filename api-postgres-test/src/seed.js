const pool = require('./models/db');

const seedDatabase = async () => {
  try {
    console.time('Tempo para realizar inserção dos dados');

    const users = Array.from({ length: 100000 }, (_, i) => [
      `User${i}`,
      `user${i}@example.com`,
      'Preferences example',
    ]);
    console.log('Inserindo usuários...');
    for (const user of users) {
      await pool.query('INSERT INTO Usuarios (nome, email, preferencias) VALUES ($1, $2, $3)', user);
    }

    const books = Array.from({ length: 100000 }, (_, i) => [
      `Livro ${i}`,
      `Autor ${i}`,
      ['Ficção', 'Não-ficção', 'Aventura', 'Romance'][i % 4],
      `Descrição do livro ${i}`,
    ]);
    console.log('Inserindo livros...');
    for (const book of books) {
      await pool.query('INSERT INTO Livros (titulo, autor, genero, descricao) VALUES ($1, $2, $3, $4)', book);
    }

    const reviews = Array.from({ length: 500000 }, (_, i) => [
      Math.floor(Math.random() * 100000) + 1,
      Math.floor(Math.random() * 10000) + 1,
      Math.floor(Math.random() * 5) + 1,  
      `Comentário ${i}`,
    ]);
    console.log('Inserindo avaliações...');
    for (const review of reviews) {
      await pool.query(
        'INSERT INTO Avaliacoes (usuario_id, livro_id, nota, comentario) VALUES ($1, $2, $3, $4)',
        review
      );
    }

    console.timeEnd('Tempo para realizar inserção dos dados');

    console.time('Tempo para realizar a busca dos dados');
    const userCount = await pool.query('SELECT COUNT(*) FROM Usuarios');
    const bookCount = await pool.query('SELECT COUNT(*) FROM Livros');
    const reviewCount = await pool.query('SELECT COUNT(*) FROM Avaliacoes');
    console.timeEnd('Tempo para realizar a busca dos dados');

    console.log(`Total de usuários: ${userCount.rows[0].count}`);
    console.log(`Total de livros: ${bookCount.rows[0].count}`);
    console.log(`Total de avaliações: ${reviewCount.rows[0].count}`);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
};

seedDatabase();
