import React from 'react';
import UserCard from '../components/UserProfile/UserCard';
import { Typography } from '@mui/material';
import BookGalleryManager from '../components/Book/BookGalleryManager';
import sampleData from "../sampleData.json";

const UserProfile = () => {

  const handleChangePassword = () => {
    // TODO: password change functionality
    console.log("Change password clicked");
  };

  const handleSignOut = () => {
    // TODO: sign out functionality
    console.log("Sign out clicked");
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <UserCard 
          user={sampleData.user}
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
          Reading List
        </Typography>
        <BookGalleryManager books={sampleData.similarBooks} limit={10} />
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
