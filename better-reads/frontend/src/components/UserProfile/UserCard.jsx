import React from 'react';
import { Box, Avatar, Typography, Button, Paper, Stack, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
import { GenreTags } from '../Book/BookUtils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

const UserCard = ({ user, onChangePassword, onSignOut }) => {
  const isGuest = user?.isGuest;
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <StyledPaper elevation={2}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.avatarUrl}
            alt={user?.username}
            sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 } }}
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
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
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

        <Stack
          direction={{ xs: 'row', sm: 'column', md: 'row' }}
          spacing={1}
          sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 2, sm: 0 }, justifyContent: 'flex-start' }}
        >
          <Button
            variant="text"
            startIcon={<LockResetIcon />}
            onClick={onChangePassword}
            sx={{
              fontStyle: 'italic',
              textTransform: 'none',
              color: 'text.secondary',
              p: { xs: '4px 8px', sm: '6px 16px' },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            Change Password
          </Button>
          {!isGuest && (
            <Button
              variant="text"
              startIcon={<LogoutIcon />}
              onClick={onSignOut}
              sx={{
                fontStyle: 'italic',
                textTransform: 'none',
                color: 'text.secondary',
                p: { xs: '4px 8px', sm: '6px 16px' },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              Sign Out
            </Button>
          )}
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
              sx={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Favorite Genres
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
              <GenreTags genres={user.favoriteGenres} />
            </Box>
          </Box>
        </>
      )}
    </StyledPaper>
  );
};

export default UserCard;
