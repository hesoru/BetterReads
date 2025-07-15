import React from 'react';
import { Box, Typography } from '@mui/material';
import BetterReadsLogo from '../../images/icons/BetterReadsLogo.svg';
import BackgroundImage from '../../images/background.png';

const HeroBanner = ({ title, backgroundImage, logo }) => {
    const styles = {
        banner: {
            width: '100%',
            textAlign: 'center',
            padding: '4rem 2rem',
            marginBottom: '2rem',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage || BackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0',
            position: 'relative',
        },
        bannerText: {
            color: 'rgb(255, 255, 255)',
            fontFamily: '"Source Serif Pro", serif',
            fontStyle: 'italic',
            textShadow: 'rgba(0, 0, 0, 0.7) 1px 1px 3px',
        },
        logoDiv: {
            height: '100px',
            width: '100%',
            backgroundImage: `url(${logo || BetterReadsLogo})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            marginBottom: '1rem',
        },
    };

    return (
        <Box sx={styles.banner}>
            <div style={styles.logoDiv}></div>
            <Typography variant="h5" sx={styles.bannerText}>
                {title}
            </Typography>
        </Box>
    );
};

export default HeroBanner;
