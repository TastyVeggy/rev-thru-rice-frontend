import { Alert, List, ListItem, ListItemText, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { signup } from '../features/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserForm } from '../components/forms/UserForm';
import { Layout } from '../components/layout/Layout';

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
  const {
    error: authError,
    isAuthenticated,
    status: authStatus,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && authStatus === 'succeeded') {
      if (prevPage === '/login' || prevPage === '/signup') {
        navigate('/');
      }
      navigate(prevPage);
    }
  }, [isAuthenticated, authStatus]);

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
    <Layout withBackground>
      <UserForm
        formName='Signup'
        handleSubmit={handleSubmit}
        redirect={{ message: 'Have an account?', route: '/login' }}
        prevPage={prevPage}
      >
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
      </UserForm>
    </Layout>
  );
}
