import sampleData from "./sampleData2.json";
import './App.css'
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import BookDetailsPage from "./components/Book/BookDetailsPage.jsx";
import UserProfile from "./pages/UserProfile";
import SearchPage from "./pages/SearchPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import Header from "./components/Home/Header";
import Login from './components/Login/Login.jsx'
import Signup from "./components/Signup/Signup.jsx";
import NLPSearch from "./pages/NLPSearch.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div>
      <Header userAvatar={sampleData.user.avatarUrl} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/books/:bookId" element={<BookDetailsPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/nlpsearch" element={<NLPSearch />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
