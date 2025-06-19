import React from 'react';
import { Link } from 'react-router-dom';
import BetterReadsLogo from '../../images/icons/BetterReadsLogo.svg';

const Header = ({ userAvatar }) => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/">
          <div style={styles.logoImage} />
        </Link>
      </div>
      <nav style={styles.nav}>
        <Link to="/search" style={styles.link}>Search</Link>
        <Link to="/profile" style={styles.avatarLink}>
          <img
            src={userAvatar}
            alt="User Avatar"
            style={styles.avatar}
          />
        </Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#1e213d',
    boxSizing: 'border-box',
    margin: 0,
  },
  logo: {
    width: '178px',
    height: '38px',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${BetterReadsLogo})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#ffffff',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  },
  avatarLink: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
};

export default Header;