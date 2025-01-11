import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteUser, updateUserInfo } from '../features/slices/authSlice';
import { editPasswordService } from '../services/editPasswordService';
import { Layout } from '../components/layout/Layout';
import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { ConfirmDialog } from '../components/dialogs/ConfirmDialog';

export default function UserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    status: authStatus,
    error: authError,
  } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState('');
  const [usernameFieldErrors, setUsernameFieldErrors] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [emailFieldErrors, setEmailFieldErrors] = useState<string[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<string[]>([]);
  const [showUserInfoUpdateSuccess, setShowUserInfoUpdateSuccess] =
    useState(false);
  const [showPasswordUpdateSuccess, setShowPasswordUpdateSuccess] =
    useState(false);
  const [showDeleteFailure, setShowDeleteFailure] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  useEffect(() => {
    if (
      !isAuthenticated &&
      !(authStatus == 'idle' || authStatus == 'loading')
    ) {
      navigate('/login');
    }
  }, [isAuthenticated, authStatus]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleEditUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameFieldErrors([]);
    setEmailFieldErrors([]);

    if (username.length < 3 || username.length > 30) {
      setUsername(user?.username ?? '');
      setUsernameFieldErrors((errors) => [
        ...errors,
        'Username must be between 3-30 characters',
      ]);
    }
    if (usernameFieldErrors.length > 0) {
      return;
    }

    const newUserInfo = {
      username: username,
      email: email,
    };
    const res = await dispatch(updateUserInfo(newUserInfo));
    if (res.type === 'auth/updateUserInfo/rejected') {
      if (authError?.includes('Username')) {
        setUsername(user?.username ?? '');
        setUsernameFieldErrors((errors) => [...errors, authError]);
      }
      if (authError?.includes('email') || authError?.includes('Email')) {
        setEmail(user?.email ?? '');
        setEmailFieldErrors((errors) => [...errors, authError]);
      }
    }
    setShowUserInfoUpdateSuccess(true);
  };

  const handleEditPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFieldErrors([]);
    if (password !== confirmPassword) {
      setPasswordFieldErrors((errors) => [
        ...errors,
        'Password and confirm password does not match',
      ]);
    } else if (password.length < 6) {
      setPasswordFieldErrors((errors) => [
        ...errors,
        'Password must be at least 6 characters',
      ]);
    }
    if (passwordFieldErrors.length > 0) {
      setPassword('');
      setConfirmPassword('');
      return;
    }

    try {
      await editPasswordService(password, confirmPassword);
    } catch (err) {
      setPassword('');
      setConfirmPassword('');
      setPasswordFieldErrors((errors) => [
        ...errors,
        err instanceof Error
          ? err.message
          : 'Unable to change password for unknown reason. Please try again',
      ]);
    }
    setShowPasswordUpdateSuccess(true);
    setPassword('');
    setConfirmPassword('');
  };

  const handleDeleteUser = async () => {
    const result = await dispatch(deleteUser());
    setOpenConfirmDelete(false);

    if (deleteUser.fulfilled.match(result)) {
      navigate('/');
    } else {
      setShowDeleteFailure(true);
    }
  };

  return (
    <Layout>
      <Box maxWidth='md'>
        <Typography variant='h4' gutterBottom>
          Change user info
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 5 }} maxWidth='sm'>
          {usernameFieldErrors.length + emailFieldErrors.length > 0 && (
            <Alert severity='error' sx={{ width: '100%' }}>
              <List>
                {usernameFieldErrors
                  .concat(emailFieldErrors)
                  .map((message, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={message} />
                    </ListItem>
                  ))}
              </List>
            </Alert>
          )}
          <Snackbar
            open={showUserInfoUpdateSuccess}
            autoHideDuration={3000}
            onClose={() => setShowUserInfoUpdateSuccess(false)}
          >
            <Alert severity='success' sx={{ width: '100%' }}>
              User info updated successfully
            </Alert>
          </Snackbar>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameFieldErrors.length > 0}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailFieldErrors.length > 0}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleEditUserInfo}
            sx={{ mt: 1 }}
          >
            <Typography>Change user info</Typography>
          </Button>
        </Box>
        <Typography variant='h4' gutterBottom>
          Change Password
        </Typography>
        <Divider sx={{ my: 2 }} />
        {passwordFieldErrors.length > 0 && (
          <Alert severity='error' sx={{ width: '100%' }}>
            <List>
              {passwordFieldErrors.map((message, index) => (
                <ListItem key={index}>
                  <ListItemText primary={message} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}
        <Snackbar
          open={showPasswordUpdateSuccess}
          autoHideDuration={3000}
          onClose={() => setShowPasswordUpdateSuccess(false)}
        >
          <Alert severity='success' sx={{ width: '100%' }}>
            Password updated successfully
          </Alert>
        </Snackbar>
        <Box sx={{ mb: 5 }} maxWidth='sm'>
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
            error={passwordFieldErrors.length > 0}
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
            error={passwordFieldErrors.length > 0}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleEditPassword}
            sx={{ mt: 1 }}
          >
            <Typography>Change password</Typography>
          </Button>
        </Box>

        <Typography color='#FF0000' variant='h4' gutterBottom>
          Delete Account
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box>
          <Typography color='text.secondary' gutterBottom>
            All account deletion is permenant. You cannot reactive a deleted
            account or recover any account information after deletion. Posts,
            reviews and comments made by you will remain as 'deleted_user' so
            please manually delete any you would like erased.
          </Typography>
          <Button
            sx={{ bgcolor: '#FF0000', mt: 1 }}
            variant='contained'
            onClick={() => setOpenConfirmDelete(true)}
          >
            <Typography>Delete your account</Typography>
          </Button>

          <ConfirmDialog
            open={openConfirmDelete}
            title='Delete account?  It is irreversible!'
            onClose={() => setOpenConfirmDelete(false)}
            onConfirm={handleDeleteUser}
          />
        </Box>
        <Snackbar
          open={showDeleteFailure}
          autoHideDuration={3000}
          onClose={() => setShowDeleteFailure(false)}
        >
          <Alert severity='error' sx={{ width: '100%' }}>
            Unable to delete account. Try again
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}
