const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '120202',
  database: process.env.DB_NAME || 'cursos_db',
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para tentar reconectar
function handleDisconnect() {
  db.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      setTimeout(handleDisconnect, 2000); // Tenta reconectar a cada 2 segundos
    } else {
      console.log('Conectado ao banco de dados');
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cursos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          descricao VARCHAR(255) NOT NULL,
          valor DECIMAL(10, 2) NOT NULL
        )
      `;
      db.query(createTableQuery, (err) => {
        if (err) {
          console.error('Erro ao criar tabela:', err);
        } else {
          console.log('Tabela de cursos criada');
        }
      });
    }
  });
}

// Inicia a primeira tentativa de conexão
handleDisconnect();

app.get('/api/cursos', (req, res) => {
  const query = 'SELECT * FROM cursos';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/cursos', (req, res) => {
  const { descricao, valor } = req.body;
  const query = 'INSERT INTO cursos (descricao, valor) VALUES (?, ?)';
  db.query(query, [descricao, valor], (err, result) => {
    if (err) throw err;
    res.status(201).json({ id: result.insertId, descricao, valor });
  });
});
app.put('/api/cursos/:id', (req, res) => {
  const { id } = req.params;
  const { descricao, valor } = req.body;
  const query = 'UPDATE cursos SET descricao = ?, valor = ? WHERE id = ?';
  db.query(query, [descricao, valor, id], (err) => {
    if (err) throw err;
    res.json({ id, descricao, valor });
  });
});

app.delete('/api/cursos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM cursos WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) throw err;
    res.sendStatus(204);
  });
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
