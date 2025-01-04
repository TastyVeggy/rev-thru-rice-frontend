import React from 'react';
import { Layout } from '../layout/Layout';
import { Box, Button, Typography } from '@mui/material';

interface UserFormProps {
  formName: string;
  handleSubmit: (e: React.FormEvent) => void;
  redirect: { message: string; route: string };
  children: React.ReactNode;
}
export const UserForm: React.FC<UserFormProps> = ({
  formName,
  handleSubmit,
  redirect,
  children,
}) => {
  return (
    <Layout withBackground>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'url("/aesthetic-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: 4,
            borderRadius: 2,
            maxWidth: 400,
          }}
        >
          <Typography component='h1' variant='h5'>
            {formName}
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {children}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 4, mb: 3 }}
            >
              <Typography variant='h6' sx={{ fontWeight: 500 }}>
                {formName}
              </Typography>
            </Button>
          </Box>
          <Typography
            component='a'
            variant='body1'
            sx={{
              color: '#0000EE',
              textDecoration: 'None',
              '&:hover': { color: 'secondary.main' },
            }}
            href={redirect.route}
          >
            {redirect.message}
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
};
