import { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/slices/authSlice';
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
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseSubforumsMenu = () => {
    setAnchorElSubforums(null);
  };
  const handleCloseCountriesMenu = () => {
    setAnchorElCountries(null);
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
    <AppBar position='static' sx={{ bgcolor: 'primary.main', height: '150px' }}>
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <a href='/'>
              <img
                src={config.logoUrl}
                alt='Logo'
                style={{ width: 'auto', height: 120 }}
              />
            </a>
          </Box>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
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
            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title='Open settings'>
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0, color: 'white' }}
                    >
                      <SportsMotorsportsIcon sx={{ mr: 2 }} fontSize='large' />
                      <Typography
                        textAlign='center'
                        variant='h5'
                        sx={{ fontWeight: 700 }}
                      >
                        {user?.username}
                      </Typography>
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
                <>
                  <Button
                    sx={{ mx: 2, my: 2 }}
                    color='inherit'
                    component={Link}
                    to='/login'
                    state={{ from: location.pathname }}
                  >
                    <Typography variant='h5' sx={{ fontWeight: 500 }}>
                      Login
                    </Typography>
                  </Button>
                  <Button
                    sx={{ mx: 2, my: 2 }}
                    color='inherit'
                    component={Link}
                    to='/signup'
                    state={{ from: location.pathname }}
                  >
                    <Typography variant='h5' sx={{ fontWeight: 500 }}>
                      Signup
                    </Typography>
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
