import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface UserFormProps {
  formName: string;
  handleSubmit: (e: React.FormEvent) => void;
  redirect: { message: string; route: string };
  prevPage: string;
  children: React.ReactNode;
}
export const UserForm: React.FC<UserFormProps> = ({
  formName,
  handleSubmit,
  redirect,
  prevPage,
  children,
}) => {
  return (
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
        // component='a'
        variant='body1'
        sx={{
          color: '#0000EE',
          // textDecoration: 'None',
          '&:hover': { color: 'secondary.main' },
        }}
        // href={redirect.route}
      >
        <Link
          to={redirect.route}
          // keep passing the previous page prior to login or signup so that when finally login or signup, can be redirected to that page
          // Home page if prior to login or signup does not need to pass the page because the logic in the signup and login page is such that it defaults to the home page anyways
          state={{ from: prevPage }}
          style={{ textDecoration: 'None', color: 'inherit' }}
        >
          {redirect.message}
        </Link>
      </Typography>
    </Box>
  );
};
