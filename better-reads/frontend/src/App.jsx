import sampleData from "./sampleData.json";
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookDetailsPage from "./components/Book/BookDetailsPage.jsx";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Home/Header";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fbfd' }}>
        <Header userAvatar={sampleData.user.avatarUrl} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={
          <BookDetailsPage 
            book={sampleData.book} 
            similarBooks={sampleData.similarBooks} 
            userReview={sampleData.userReview}
            otherReviews={sampleData.otherReviews}
          />
        } />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
