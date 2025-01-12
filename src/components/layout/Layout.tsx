import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material';
import { Header } from './Header';

let theme = createTheme({
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

theme = responsiveFontSizes(theme);

export const Layout: React.FC<LayoutProps> = ({
  withBackground = false,
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          width: '100%',
        }}
      >
        <Header />
        {withBackground ? (
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
            {children}
          </Box>
        ) : (
          <Container sx={{ mt: 4, mb: 4 }}> {children}</Container>
        )}
      </Box>
    </ThemeProvider>
  );
};
