import { Alert, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { login } from '../features/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserForm } from '../components/forms/UserForm';
import { Layout } from '../components/layout/Layout';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const prevPage = (location.state as { from?: string })?.from || '/';
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (prevPage === '/login' || prevPage === '/signup') {
        navigate('/');
      }
      navigate(prevPage);
    }
  }, [isAuthenticated]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(login({ username, password }));
    if (res.type === 'auth/login/rejected') {
      setAuthError('Invalid username or password');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <Layout withBackground>
      <UserForm
        formName='Login'
        handleSubmit={handleSubmit}
        redirect={{ message: "Don't have an account?", route: '/signup' }}
        prevPage={prevPage}
      >
        {authError && (
          <Alert severity='error' sx={{ width: '100%', md: 2, mt: 2 }}>
            {authError}
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
      </UserForm>
    </Layout>
  );
}
