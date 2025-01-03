import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import { Layout } from '../components/Layout';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../features/store';
import { login } from '../features/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const prevPage = (location.state as { from?: string })?.from || '/';
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(login({ username, password }));
    if (res.type === 'auth/login/rejected') {
      setAuthError('Invalid username or password');
      setUsername('');
      setPassword('');
    } else {
      navigate(prevPage);
    }
  };
  return (
    <Layout withBackground={true}>
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
            Login
          </Typography>
          {authError && (
            <Alert severity='error' sx={{ width: '100%', md: 2, mt: 2 }}>
              {authError}
            </Alert>
          )}
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!authError}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='password'
              label='Password'
              name='password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!authError}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 4, mb: 4 }}
            >
              <Typography variant='h6' sx={{ fontWeight: 500 }}>
                Login
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
