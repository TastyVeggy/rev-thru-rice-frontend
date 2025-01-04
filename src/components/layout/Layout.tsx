import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { Header } from './Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a2c1a',
    },
    secondary: {
      main: '#ffa634',
    },
    background: {
      default: '#f4f1ea',
    },
  },
});

interface LayoutProps {
  withBackground?: boolean;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  withBackground = false,
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bdcolor: 'background.default' }}>
        <Header />
        {withBackground ? (
          children
        ) : (
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            {' '}
            {children}
          </Container>
        )}
      </Box>
    </ThemeProvider>
  );
};
