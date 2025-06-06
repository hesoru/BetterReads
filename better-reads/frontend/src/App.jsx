import sampleData from "./sampleData2.json";
import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BookDetailsPage from "./components/Book/BookDetailsPage.jsx";
import UserProfile from "./pages/UserProfile";
import SearchPage from "./pages/SearchPage";
import Header from "./components/Home/Header";
import LoginPage from "./pages/LoginPage";

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname !== '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fbfd' }}>
      {showHeader && <Header userAvatar={sampleData.user.avatarUrl} />}
      <main style={{ flex: 1 }}>
        <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/books/:isbn" element={
                <BookDetailsPage />
            } />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App
