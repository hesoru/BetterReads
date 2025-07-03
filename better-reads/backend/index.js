import express from 'express';
import connectDB from './db.js';
import cors from 'cors';
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";
import bookRoutes from "./routes/books.js";
import {auth} from 'express-openid-connect';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.BACKEND_URL;
console.log("BASE_URL: ", process.env.SECRET_KEY);

console.log("process.env.SECRET: ", process.env.SECRET_KEY);
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET_KEY,
  baseURL: BASE_URL,
  clientID: 'pAVv8U0zwfKb7FbrndokWVqMy8LV6Eb3',
  issuerBaseURL: 'https://dev-vzxfgg0fd4am2x51.us.auth0.com'
};



const app = express();
const PORT = process.env.PORT || 3000;
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


app.use(express.json());
app.use(cors());

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
app.get('/callback', (req, res) => {
  res.send('Callback hit');
});

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/books', bookRoutes);

// only connect to prod database when NOT running tests
if (process.env.NODE_ENV !== 'test') {
  await connectDB();                
  app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
}

export default app;  