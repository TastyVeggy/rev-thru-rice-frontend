import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { Layout } from '../components/Layout';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../features/store';
import { signup } from '../features/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const prevPage = (location.state as { from?: string })?.from || '/';
  const [username, setUsername] = useState<string>('');
  const [usernameFieldError, setUsernameFieldError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailFieldError, setEmailFieldError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { error: authError } = useSelector((state: any) => state.auth);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameFieldError(false);
    setEmailFieldError(false);
    setErrorMessages([]);

    // Client side checking
    if (username.length < 3 || username.length > 30) {
      setPassword('');
      setConfirmPassword('');
      setUsername('');
      setUsernameFieldError(true);
      setErrorMessages((errors) => [
        ...errors,
        'Username must be between 3-30 characters',
      ]);
    }
    if (password !== confirmPassword) {
      setPassword('');
      setConfirmPassword('');
      setErrorMessages((errors) => [
        ...errors,
        'Password and confirm password does not match',
      ]);
    } else if (password.length < 6) {
      setPassword('');
      setConfirmPassword('');
      setErrorMessages((errors) => [
        ...errors,
        'Password must be at least 6 characters',
      ]);
    }
    if (errorMessages.length > 0) {
      return;
    }

    // Server side checking
    const res = await dispatch(
      signup({ username, email, password, confirm_password: confirmPassword })
    );
    if (res.type === 'auth/signup/rejected') {
      setPassword('');
      setConfirmPassword('');
      if (authError?.includes('Username')) {
        setUsername('');
        setUsernameFieldError(true);
        setErrorMessages([authError]);
      }
      if (authError?.includes('email') || authError?.includes('Email')) {
        setEmail('');
        setEmailFieldError(true);
        setErrorMessages([authError]);
      }
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
            Signup
          </Typography>
          {errorMessages.length > 0 && (
            <Alert severity='error' sx={{ width: '100%', md: 2, mt: 2 }}>
              <List>
                {errorMessages.map((message, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={message} />
                  </ListItem>
                ))}
              </List>
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
              error={!!usernameFieldError}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email'
              name='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailFieldError}
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
              error={errorMessages.length > 0}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              id='confirm_password'
              label='Confirm Password'
              name='confirm_password'
              type='password'
              autoComplete='confirm-password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errorMessages.length > 0}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 4, mb: 4 }}
            >
              <Typography variant='h6' sx={{ fontWeight: 500 }}>
                Signup
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}