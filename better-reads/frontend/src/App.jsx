import sampleData from "./sampleData2.json";
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookDetailsPage from "./components/Book/BookDetailsPage.jsx";
import UserProfile from "./pages/UserProfile";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Home/Header";
import Login from './components/Login/Login.jsx'
import Signup from "./components/Signup/Signup.jsx";

function App() {
    const firstBookIsbn = Object.keys(sampleData.books)[0];
    //console.log(firstBookIsbn)
  return (
    <>
    {/* <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fbfd' }}>
      <Header userAvatar={sampleData.user.avatarUrl} />
      <main style={{ flex: 1 }}></main>
    </div> */}
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/books/:isbn" element={
                <BookDetailsPage />
            } />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
