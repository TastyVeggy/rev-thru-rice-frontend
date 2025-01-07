import { Box, Button, Typography } from '@mui/material';

interface PostFormProps {
  category: 'Review' | 'Post';
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

export const PostForm: React.FC<PostFormProps> = ({
  category,
  handleSubmit,
  children,
}) => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Create New {category}
      </Typography>
      <Box component='form' onSubmit={handleSubmit}>
        {children}
        <Button
          type='submit'
          variant='contained'
          color='primary'
          sx={{ mt: 2 }}
        >
          Share with the world!
        </Button>
      </Box>
    </Box>
  );
};
