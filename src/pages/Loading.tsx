import { Box, CircularProgress } from '@mui/material';
import { Layout } from '../components/layout/Layout';

export const LoadingPage: React.FC = () => {
  return (
    <Layout>
      <Box
        sx={{
          minHeight: '80vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ position: 'relative', width: 80, height: 80, mb: 4 }}>
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: 'primary.main',
              positon: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        </Box>
      </Box>
    </Layout>
  );
};
