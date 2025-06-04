import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import StarRating from './components/ratings/starRating'; // Import the StarRating component
import BookReview from './components/bookReview'; // Import the BookReview component

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {/* Test StarRating components */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Star Rating Tests:</h2>
        <div>
          <p>Rating: 0</p>
          <StarRating rating={0} />
        </div>
        <div>
          <p>Rating: 2.5</p>
          <StarRating rating={2.5} />
        </div>
        <div>
          <p>Rating: 3.75 (e.g., 3 and 3/4 stars)</p>
          <StarRating rating={3.75} />
        </div>
        <div>
          <p>Rating: 5</p>
          <StarRating rating={5} />
        </div>
        <div>
          <p>Rating: 1.25 (e.g., 1 and 1/4 star)</p>
          <StarRating rating={1.25} />
        </div>
      </div>

      {/* Test BookReview component */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Book Review Test:</h2>
        <BookReview />
        <BookReview
          userImage="https://randomuser.me/api/portraits/women/75.jpg"
          username="JaneReadsAlot"
          rating={4.5}
          reviewText="An absolutely captivating story from beginning to end. I couldn't put it down!"
        />
      </div>
    </>
  );
}

export default App;
