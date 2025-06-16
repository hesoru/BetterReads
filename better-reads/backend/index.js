
import express from 'express';
import connectDB from './db.js';
import cors from 'cors';
import userRoutes from "./routes/users.js";
//import reviewRoutes from "./routes/reviews.js";
import bookRoutes from "./routes/books.js";

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

app.use('/users', userRoutes);

