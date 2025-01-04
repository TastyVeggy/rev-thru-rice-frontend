import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface FlagIconProps {
  id: number;
  name: string;
  iso: string;
}

// stolen from ChatGPT
export const FlagIcon: React.FC<FlagIconProps> = ({ id, name, iso }) => {
  return (
    <Link
      to={`/?country_id=${id}`}
      style={{ textDecoration: 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': {
            '& .MuiTypography-root': {
              color: 'secondary.main',
            },
          },
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            overflow: 'hidden',
            mb: 1,
            border: '2px solid',
            borderColor: 'primary.main',
            position: 'relative',
            '&:hover': {
              borderColor: 'secondary.main',
            },
          }}
        >
          <img
            src={`https://hatscripts.github.io/circle-flags/flags/${iso.toLowerCase()}.svg`}
            alt={`${name} flag`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Typography
          variant='body2'
          align='center'
          sx={{ color: 'primary.main' }}
        >
          {name}
        </Typography>
      </Box>
    </Link>
  );
};
