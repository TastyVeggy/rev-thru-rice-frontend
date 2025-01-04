import { Box, Button, Typography } from '@mui/material';
import { Layout } from '../layout/Layout';

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
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Create New {category}
        </Typography>
        <form onSubmit={handleSubmit}>
          {children}
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
          >
            Share with the world!
          </Button>
        </form>
      </Box>
    </Layout>
  );
};
