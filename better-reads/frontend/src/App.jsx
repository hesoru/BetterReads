import sampleData from "./sampleData2.json";
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookDetailsPage from "./components/Book/BookDetailsPage.jsx";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Home/Header";

function App() {
    const firstBookIsbn = Object.keys(sampleData.books)[0];
    //console.log(firstBookIsbn)
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fbfd' }}>
        <Header userAvatar={sampleData.user.avatarUrl} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/books/:isbn" element={
                <BookDetailsPage />
            } />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
