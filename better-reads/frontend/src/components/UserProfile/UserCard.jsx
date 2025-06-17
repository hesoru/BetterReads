import React from 'react';
import { Box, Avatar, Typography, Button, Paper, Stack, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
import { GenreTags } from '../Book/BookUtils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
}));

const UserCard = ({ user, onChangePassword, onSignOut }) => {

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <StyledPaper elevation={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.avatarUrl}
            alt={user?.username}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              textAlign="left"
              color="#000"
              sx={{ 
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
              }}
            >
              {user?.username}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              textAlign="left"
              sx={{ fontFamily: 'Georgia, serif' }}
            >
              Joined {formatDate(user?.join_time)}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="text"
            startIcon={<LockResetIcon />}
            onClick={onChangePassword}
            sx={{
              fontStyle: 'italic',
              textTransform: 'none',
              color: 'text.secondary'
            }}
          >
            Change Password
          </Button>
          <Button
            variant="text"
            startIcon={<LogoutIcon />}
            onClick={onSignOut}
            sx={{
              fontStyle: 'italic',
              textTransform: 'none',
              color: 'text.secondary'
            }}
          >
            Sign Out
          </Button>
        </Stack>
      </Box>

      {user?.favoriteGenres && user.favoriteGenres.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography 
              variant="h6" 
              gutterBottom
              textAlign="left"
              sx={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              Favorite Genres
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <GenreTags genres={user.favoriteGenres} />
            </Box>
          </Box>
        </>
      )}
    </StyledPaper>
  );
};

export default UserCard;
