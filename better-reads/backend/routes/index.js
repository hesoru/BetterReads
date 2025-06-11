const express = require('express');
const mongoose = require('mongoose')

const app = express();
const PORT = 3000;

app.use(express.json());

// BetterReads mongoURI
const mongoURI = 'mongodb+srv://rex015:iDPU4rvt5HjtDrW1@sandbox.bcebozm.mongodb.net/?retryWrites=true&w=majority&appName=Sandbox'; 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello from Express and MongoDB!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});