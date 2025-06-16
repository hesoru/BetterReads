
import express from 'express';
import connectDB from './db.js';
import cors from 'cors';

const app = express();
const PORT = 3000;
connectDB();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

