import React from 'react';
import UserCard from '../components/UserProfile/UserCard';
import { Typography } from '@mui/material';
import BookGalleryManager from '../components/Book/BookGalleryManager';
import { useSelector,  useDispatch} from "react-redux";
import { clearUser } from '../redux/UserSlice';
import {clearBooklist} from "../redux/Booklist.js";
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const user = useSelector((state) => state.user?.user);
  const booklist = useSelector((state) => state.booklist.items);
  // console.log("Current user:", user);
  // console.log("Current booklist:", booklist);

  //TODO: Limit some UI features if User is a guest
  const isGuest = user?.isGuest;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO: Currently pulling the list of bookIDs for the user's wishlist

  const handleChangePassword = () => {
    // TODO: password change functionality
    console.log("Change password clicked");

  };

  const handleSignOut = async () => {
    // TODO: sign out functionality
    console.log("Sign out clicked");
    try {

      dispatch(clearUser());
      dispatch(clearBooklist());
      navigate('/');
      localStorage.removeItem('appState');

      // Redirect to login or home page

    } catch (err) {
      console.error('Sign out failed:', err);
    }


  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <UserCard 
          user={user}
          onChangePassword={handleChangePassword}
          onSignOut={handleSignOut}
        />

        <Typography
            variant="h6"
            gutterBottom
            textAlign="left"
            sx={{
              fontFamily: 'Georgia, serif',
              fontWeight: 600,
              marginTop: 4,
              fontStyle: 'italic'
            }}
        >
          {isGuest ? 'Reading List so far... (Sign up to save it!)' : 'Reading List'}
        </Typography>
        <BookGalleryManager books={booklist} limit={10} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: 'var(--color-bg-alt)',
    minHeight: '100vh'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  }
}

export default UserProfile;
