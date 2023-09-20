const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());
app.listen(3001, () => console.log('Server running on port 3001'));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'likeme',
  port: 5432
});

pool.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log('Connected to database');
});

app.post('/posts', async (req, res) => {
  try {
    const { titulo, url, descripcion } = req.body;
    if (!titulo || !url || !descripcion) {
      return res.status(400).json({ msg: 'Datos incompletos' });
    }
    const dbInstance = await pool.connect();
    const query = `INSERT INTO posts (titulo, img, descripcion) VALUES ($1, $2, $3)`;
    const values = [titulo, url, descripcion];
    await dbInstance.query(query, values);
    res.status(200).json({ msg: 'Post agregado' });
    dbInstance.release();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al agregar post' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const dbInstance = await pool.connect();
    const query = `SELECT * FROM posts`;
    const response = await dbInstance.query(query);
    res.status(200).json(response.rows);
    dbInstance.release();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error al obtener posts' });
  }
});