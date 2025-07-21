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
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());


// Configure CORS with restrictive settings
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://betterreads.com', 'https://www.betterreads.com'] // Restrict to production domains
    : ['http://localhost:3000', 'http://localhost:5173'], // Allow local development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));


// security middleware
// Configure Helmet with strict CSP and other security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline in production
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://covers.openlibrary.org'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", process.env.PYTHON_API_NLPTEXTSEARCH_URL],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"], // Prevents site from being framed (clickjacking protection)
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // Set X-Frame-Options header to prevent clickjacking
  frameguard: { action: 'deny' },
  // Enable X-XSS-Protection to prevent reflected XSS attacks
  xssFilter: true,
  // Prevent MIME-type sniffing
  noSniff: true,
}));

// Disable X-Powered-By header to prevent information disclosure
app.disable('x-powered-by');


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(xssClean()); // sanitize user input

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/books', bookRoutes);
app.use('/recommendations', recommendationsRoutes);
app.use('/nlp', nlpRoutes);

// The "catchall" handler: for any request that doesn't match one above, throw a 404 error.
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

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