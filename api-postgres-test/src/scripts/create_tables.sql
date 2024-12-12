CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    preferencias TEXT
);

CREATE TABLE Livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    descricao TEXT
);

CREATE TABLE Avaliacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES Usuarios(id) ON DELETE CASCADE,
    livro_id INT REFERENCES Livros(id) ON DELETE CASCADE,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT
);
