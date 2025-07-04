import React from 'react';
import UserCard from '../components/UserProfile/UserCard';
import { Typography, Container, Box } from '@mui/material';
import BookGalleryManager from '../components/Book/BookGalleryManager';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/UserSlice';
import { clearBooklist } from '../redux/Booklist.js';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const user = useSelector((state) => state.user?.user);
  const booklist = useSelector((state) => state.booklist.items);
  const isGuest = user?.isGuest;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangePassword = () => {
    // TODO: password change functionality
    console.log("Change password clicked");
  };

  const handleSignOut = async () => {
    console.log("Sign out clicked");
    try {
      dispatch(clearUser());
      dispatch(clearBooklist());
      navigate('/');
      localStorage.removeItem('appState');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'var(--color-bg-alt)', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
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
              fontStyle: 'italic',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
        >
          {isGuest ? 'Reading List so far... (Sign up to save it!)' : 'Reading List'}
        </Typography>
        <BookGalleryManager books={booklist} limit={10} />
      </Container>
    </Box>
  );
};

export default UserProfile;
