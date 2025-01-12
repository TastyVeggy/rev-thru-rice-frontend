import { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/slices/authSlice';
import MenuIcon from '@mui/icons-material/Menu';
import ForumIcon from '@mui/icons-material/Forum';
import PublicIcon from '@mui/icons-material/Public';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import HeaderMenu from './Submenu';
import { fetchSubforums } from '../../features/slices/subforumsSlice';
import { fetchCountries } from '../../features/slices/countriesSlice';
import { config } from '../../config';

export function Header() {
  const [anchorElSideMenu, setAnchorElSideMenu] = useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElSubforums, setAnchorElSubforums] =
    useState<null | HTMLElement>(null);
  const [anchorElCountries, setAnchorElCountries] =
    useState<null | HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: subforums, status: subforumsStatus } = useSelector(
    (state: RootState) => state.subforums
  );
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );
  const {
    isAuthenticated,
    user,
    status: authStatus,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (subforumsStatus == 'idle') {
      dispatch(fetchSubforums());
    }
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
  }, [dispatch, subforumsStatus, countriesStatus]);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenSubforumsMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElSubforums(event.currentTarget);
  };
  const handleOpenCountriesMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElCountries(event.currentTarget);
  };
  const handleOpenSideMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElSideMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseSubforumsMenu = () => {
    setAnchorElSubforums(null);
  };
  const handleCloseCountriesMenu = () => {
    setAnchorElCountries(null);
  };
  const handleCloseSideMenu = () => {
    setAnchorElSideMenu(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
  };

  const handleCountryClick = (countryID: number) => {
    navigate(`/?country_id=${countryID}`);
    handleCloseCountriesMenu();
  };

  const handleSubforumClick = (subforumID: number) => {
    navigate(`/subforum/${subforumID}`);
    handleCloseSubforumsMenu();
  };

  const handleUserClick = () => {
    if (!user) {
      throw new Error('user is not logged in');
    } else {
      navigate(`/user/${user.id}`);
      handleCloseUserMenu();
    }
  };

  return (
    <AppBar
      position='static'
      sx={{
        bgcolor: 'primary.main',
        height: { xs: 80, sm: 100, md: 100, lg: 150 },
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{
            height: { xs: 80, sm: 100, md: 100, lg: 150 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none' },
            }}
          >
            <IconButton
              size='large'
              onClick={handleOpenSideMenu}
              color='inherit'
            >
              <MenuIcon fontSize='large' />
            </IconButton>
            <Menu
              id='sidemenu'
              anchorEl={anchorElSideMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={!!anchorElSideMenu}
              onClose={handleCloseSideMenu}
              sx={{
                display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' },
              }}
            >
              {[
                <MenuItem
                  key='sideSubforumsMenu'
                  onClick={handleOpenSubforumsMenu}
                >
                  <ForumIcon sx={{ mr: 1 }} />
                  <Typography textAlign='center'>Subforums</Typography>
                </MenuItem>,
                <MenuItem
                  key='sideCountriesMenu'
                  onClick={handleOpenCountriesMenu}
                >
                  <PublicIcon sx={{ mr: 1 }} />
                  <Typography textAlign='center'>Countries</Typography>
                </MenuItem>,
              ]}
            </Menu>
          </Box>
          <Box
            sx={{
              position: {
                sm: 'absolute',
                md: 'absolute',
                lg: 'relative',
              },
              left: {
                sm: '50%',
                md: '50%',
                lg: 'initial',
              },
              transform: {
                sm: 'translateX(-50%)',
                md: 'translateX(-50%)',
                lg: 'none',
              },
              display: { xs: 'none', sm: 'block', md: 'block', lg: 'flex' },
            }}
          >
            <a href='/'>
              <img src={config.logoUrl} alt='Logo' className='logo' />
            </a>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: { xs: 'block', sm: 'none', md: 'none', lg: 'none' },
            }}
          >
            <a href='/'>
              <img src={'/text_logo.png'} alt='Logo' className='logo' />
            </a>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
            }}
          >
            <HeaderMenu
              anchorEl={anchorElSubforums}
              label='subforums'
              items={subforums}
              onClose={handleCloseSubforumsMenu}
              onMenuClick={handleOpenSubforumsMenu}
              onItemClick={handleSubforumClick}
            />
            <HeaderMenu
              anchorEl={anchorElCountries}
              label='countries'
              items={countries}
              onClose={handleCloseCountriesMenu}
              onMenuClick={handleOpenCountriesMenu}
              onItemClick={handleCountryClick}
            />
          </Box>
          {(authStatus === 'succeeded' || authStatus === 'failed') && (
            <Box
              sx={{
                flexGrow: 0,
                display: 'flex',
              }}
            >
              {isAuthenticated ? (
                <>
                  <Tooltip title='Open settings'>
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0, color: 'white' }}
                    >
                      <Box display={{ xs: 'none', sm: 'flex' }}>
                        <SportsMotorsportsIcon
                          sx={{ mr: 2 }}
                          fontSize='large'
                        />
                        <Typography
                          textAlign='center'
                          variant='h5'
                          sx={{ fontWeight: 700 }}
                        >
                          {user?.username}
                        </Typography>
                      </Box>
                      <Box
                        display={{
                          xs: 'flex',
                          sm: 'none',
                          md: 'none',
                          lg: 'none',
                        }}
                      >
                        <SportsMotorsportsIcon
                          sx={{ mr: 1 }}
                          fontSize='medium'
                        />
                        <Typography
                          textAlign='center'
                          variant='subtitle1'
                          sx={{ fontWeight: 'bold' }}
                        >
                          {user?.username}
                        </Typography>
                      </Box>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: `45px` }}
                    id='user-bar'
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleUserClick}>
                      <SettingsIcon sx={{ mr: 1 }} />
                      <Typography textAlign='center'>Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      <Typography textAlign='center'>Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box display='flex'>
                  <Button
                    sx={{ mr: 2, my: 2 }}
                    color='inherit'
                    component={Link}
                    to='/login'
                    state={{ from: location.pathname }}
                  >
                    <Box
                      sx={{
                        display: {
                          xs: 'flex',
                          sm: 'none',
                          md: 'none',
                          lg: 'none',
                        },
                      }}
                    >
                      <Typography variant='subtitle1'>Login</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: {
                          xs: 'none',
                          sm: 'flex',
                          md: 'flex',
                          lg: 'flex',
                        },
                      }}
                    >
                      <Typography variant='h5' sx={{ fontWeight: 500 }}>
                        Login
                      </Typography>
                    </Box>
                  </Button>
                  <Button
                    sx={{
                      mx: 2,
                      my: 2,
                      display: {
                        xs: 'none',
                        sm: 'none',
                        md: 'none',
                        lg: 'flex',
                      },
                    }}
                    color='inherit'
                    component={Link}
                    to='/signup'
                    state={{ from: location.pathname }}
                  >
                    <Typography variant='h5' sx={{ fontWeight: 500 }}>
                      Signup
                    </Typography>
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
