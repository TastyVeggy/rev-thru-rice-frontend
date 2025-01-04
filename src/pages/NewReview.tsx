import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../features/store';
import { useEffect, useState } from 'react';
import { fetchCountries } from '../features/slices/countriesSlice';
import { fetchSubforums } from '../features/slices/subforumsSlice';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PostForm } from '../components/forms/PostForm';
import 'flag-icons/css/flag-icons.min.css';
import { createReviewService, ReviewReq } from '../services/createShopService';
import Map from '../components/map/Map';

export default function NewReviewPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: subforums, status: subforumsStatus } = useSelector(
    (state: RootState) => state.subforums
  );
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subforumSelected, setSubforumSelected] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopCountry, setShopCountry] = useState('');
  const [isLocationPicked, setIsLocationPicked] = useState(false);
  const [shopAddress, setShopAddress] = useState<string | null>('');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number }>({
    lat: 10000, // ridiculous values so that server will respond with error if for some reason submission happens without properly setting the lat-long
    lng: 10000,
  });
  const [rating, setRating] = useState(2);
  const [formError, setFormError] = useState<string | null>(null);
  const [openMap, setOpenMap] = useState(false);

  useEffect(() => {
    if (subforumsStatus === 'idle') {
      dispatch(fetchSubforums());
    }
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
  }, [dispatch, subforumsStatus, countriesStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (rating === 0) {
        setFormError(
          "You have to give at least 1 star even if you think it's so bad the government should shut it down"
        );
      } else {
        const reviewReq: ReviewReq = {
          post: {
            title: title,
            content: content,
            countries: [],
          },
          shop: {
            name: shopName,
            lat: latLng.lat,
            lng: latLng.lng,
            address: shopAddress,
            country: shopCountry,
          },
          rating: {
            score: rating,
          },
        };
        const newReview = await createReviewService(
          reviewReq,
          subforumSelected
        );
        console.log(newReview);
        navigate(`/reviews/${newReview.shop.id}`);
      }
    } catch (error) {
      console.log(error);
      navigate('/');
    }
  };

  const handleClickOpenMap = () => {
    setOpenMap(true);
  };
  const handleCloseMap = () => {
    setOpenMap(false);
  };
  const handleSubforumChange = (event: SelectChangeEvent) => {
    setSubforumSelected(event.target.value as string);
  };
  const handleMapSubmit = (
    newLat: number,
    newLng: number,
    newCountry: string,
    newAddress: string | null
  ) => {
    setLatLng({
      lat: newLat,
      lng: newLng,
    });
    console.log(newCountry);
    setShopCountry(newCountry);
    setShopAddress(newAddress);
    setIsLocationPicked(true);
    setOpenMap(false);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

  return (
    <PostForm category='Review' handleSubmit={handleSubmit}>
      {formError && (
        <Alert severity='error' sx={{ width: '100%', md: 2, mt: 2 }}>
          {formError}
        </Alert>
      )}
      <TextField
        margin='normal'
        required
        fullWidth
        id='title'
        name='title'
        label='Review Title'
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormControl fullWidth margin='normal' required>
        <InputLabel id='subforum-select-label'>Subforum</InputLabel>
        <Select
          labelId='subforum-select-label'
          id='subforum-select'
          value={subforumSelected}
          label='Subforum'
          onChange={handleSubforumChange}
        >
          {subforums
            .filter((subforum) => subforum.category === 'Review')
            .map((subforum) => (
              <MenuItem key={subforum.id} value={subforum.id}>
                {subforum.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Typography variant='h5' sx={{ mt: 6 }}>
        Shop Details
      </Typography>
      <TextField
        margin='normal'
        required
        fullWidth
        id='name'
        name='name'
        label='Name of the Shop'
        value={shopName}
        sx={{ mb: 3 }}
        onChange={(e) => setShopName(e.target.value)}
      />
      <TextField
        required
        fullWidth
        disabled={!isLocationPicked}
        id='name'
        name='name'
        label='Address of the Shop'
        value={shopAddress}
        onChange={(e) => setShopName(e.target.value)}
        helperText={
          isLocationPicked
            ? 'Edit if necessary'
            : 'Select location on map first, edit after if necessary'
        }
      />
      <TextField
        required
        fullWidth
        disabled
        id='name'
        name='name'
        label='Country of the Shop'
        sx={{ mt: 1 }}
        value={shopCountry}
        onChange={(e) => setShopName(e.target.value)}
        helperText='Determined by the location on map you pick'
      />
      <Button
        variant='contained'
        color='secondary'
        sx={{ mt: 1 }}
        onClick={handleClickOpenMap}
      >
        Select shop location
      </Button>
      <BootstrapDialog
        onClose={handleCloseMap}
        aria-labelledby='map-dialog'
        open={openMap}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '16px',
          }}
        >
          <Typography variant='h5' component='span' sx={{ fontWeight: 'bold' }}>
            Select your shop location
          </Typography>
          <IconButton edge='end' color='primary' onClick={handleCloseMap}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography color='#FF0000' sx={{ mb: 2 }}>
            Note: Even though using the search function will add a marker, you
            yourself will have to click a point on the map before submitting
            location
          </Typography>
          <Map
            allowedCountries={countries.map((country) => country.name)}
            onSubmit={handleMapSubmit}
          />
        </DialogContent>
      </BootstrapDialog>
      <TextField
        margin='normal'
        required
        fullWidth
        id='content'
        name='content'
        label='Review Content'
        multiline
        rows={5}
        value={content}
        sx={{
          mt: 8,
        }}
        onChange={(e) => setContent(e.target.value)}
      />
      <Box>
        <Typography variant='h6'> Final Rating</Typography>
        <Rating
          name='rating'
          value={rating}
          onChange={(_, newRating) => {
            setRating(newRating ?? 0);
          }}
        />
      </Box>
    </PostForm>
  );
}
