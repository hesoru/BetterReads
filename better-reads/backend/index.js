import express from 'express';
import connectDB from './db.js';
import cors from 'cors';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import bookRoutes from "./routes/books.js";
import recommendationsRoutes from "./routes/recommendations.js";
import nlpRoutes from "./routes/nlptextsearch.js";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// security middleware
app.use(helmet()); // set security headers
app.use(xssClean()); // sanitize user input

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/books', bookRoutes);
app.use('/recommendations', recommendationsRoutes);
app.use('/nlp',nlpRoutes);

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await connectDB();
      app.listen(PORT, () =>
          console.log(`Server running at ${process.env.BASE_URL || `http://localhost:${PORT}`}`)
      );
    } catch (err) {
      console.error('Database connection failed:', err.message);
      process.exit(1);
    }
  })();
}

// only connect to prod database when NOT running tests
// if (process.env.NODE_ENV !== 'test') {
//   await connectDB();
//   app.listen(PORT, () =>
//     console.log(`Server running at http://localhost:${PORT}`)
//   );
// }

export default app;  