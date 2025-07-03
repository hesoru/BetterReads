import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import BetterReadsLogo from '../../images/icons/BetterReadsLogo.svg';
import { NoirNavy } from '../../styles/colors';

const Header = ({ userAvatar }) => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: NoirNavy, padding: '5px 0' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <RouterLink to="/">
          <Box
            component="img"
            src={BetterReadsLogo}
            alt="BetterReads Logo"
            sx={{ height: 38, width: 178, display: 'block' }}
          />
        </RouterLink>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/search">
            Search
          </Button>
          <IconButton component={RouterLink} to="/profile">
            <Avatar src={userAvatar} alt="User Avatar" sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;