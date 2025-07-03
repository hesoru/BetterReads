import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BetterReadsLogo from '../../images/icons/BetterReadsLogo.svg';
import { NoirNavy, PaperbackPureWhite } from '../../styles/colors';

const Header = ({ userAvatar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = (
    <Box>
      <Button color="inherit" component={RouterLink} to="/search" onClick={handleMenuClose}>
        Search
      </Button>
      <IconButton component={RouterLink} to="/profile" onClick={handleMenuClose}>
        <Avatar src={userAvatar} alt="User Avatar" sx={{ width: 40, height: 40 }} />
      </IconButton>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: NoirNavy }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <RouterLink to="/">
          <Box
            component="img"
            src={BetterReadsLogo}
            alt="BetterReads Logo"
            sx={{ height: 38, width: 178, display: 'block' }}
          />
        </RouterLink>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: NoirNavy,
                  color: PaperbackPureWhite
                }
              }}
            >
              <MenuItem component={RouterLink} to="/search" onClick={handleMenuClose}>Search</MenuItem>
              <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>Profile</MenuItem>
            </Menu>
          </>
        ) : (
          menuItems
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;