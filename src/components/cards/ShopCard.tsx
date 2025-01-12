import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Rating as RatingComponent,
  TextField,
  Typography,
} from '@mui/material';
import { Shop } from '../../interfaces/review';
import { Map } from '../map/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { ConfirmDialog } from '../dialogs/ConfirmDialog';
import { MapSearchDialog } from '../dialogs/MapSearchDialog';

interface ShopCardProps {
  shop: Shop;
  reviewWriterID: number;
  currentUserRatingScore: number;
  onMutateRating: (newRatingScore: number) => void;
  onEditShop: (newShop: Shop) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  reviewWriterID,
  currentUserRatingScore,
  onMutateRating,
  onEditShop,
}: ShopCardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [openEditShopDialog, setOpenEditShopDialog] = useState(false);
  const [editableShop, setEditableShop] = useState<Shop>(shop);
  const [openMap, setOpenMap] = useState(false);

  const handleMapSubmit = (
    newLat: number,
    newLng: number,
    newCountry: string,
    newAddress: string | null
  ) => {
    setEditableShop((prevShop) => ({
      ...prevShop,
      lat: newLat,
      lng: newLng,
      country: newCountry,
      address: newAddress,
    }));
    setOpenMap(false);
  };

  const handleConfirmEditShop = () => {
    onEditShop(editableShop);
    setOpenEditShopDialog(false);
  };

  const handleCloseEditShopDialog = () => {
    setOpenEditShopDialog(false);
    setEditableShop(shop);
  };

  const handleChangeRating = (
    _: React.SyntheticEvent,
    newRating: number | null
  ) => {
    if (reviewWriterID === user?.id && !newRating) {
      alert(
        'Writer of the review must leave a shop rating of 1-5. You may edit it but you cannot remove it!'
      );
    } else {
      onMutateRating(newRating ?? 0);
    }
  };

  return (
    <Card
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        sx={{ pb: 0 }}
        title={
          <Typography variant='h6' fontWeight='bold' textAlign='center'>
            Shop: {shop.name}
          </Typography>
        }
      />
      <CardContent
        sx={{
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ width: '100%', flex: 9 }}>
          <Map lat={shop.lat} lng={shop.lng} address={shop.address} />
        </Box>
        <Box
          display='flex'
          justifyContent='center'
          alignItems={'center'}
          width='100%'
          flex='2'
        >
          <LocationOnIcon />
          <Typography
            variant='subtitle1'
            component='a'
            color='#0000EE'
            sx={{
              textAlign: 'center',
              textDecoration: 'none',
              '&:hover': { color: 'secondary.main' },
            }}
            href={shop.map_link}
            target='_blank'
            rel='noopener noreferrer'
          >
            {shop.address}
          </Typography>
        </Box>
        <Box
          display='flex'
          flexDirection='column'
          width='100%'
          alignItems='center'
          flex='1'
          sx={{ p: 1 }}
        >
          <Typography>Average Rating</Typography>
          <RatingComponent value={shop.avg_rating} readOnly precision={0.1} />
          <Typography sx={{ mt: 2 }}>Your Rating</Typography>
          <RatingComponent
            value={currentUserRatingScore}
            onChange={handleChangeRating}
          />
        </Box>
        {reviewWriterID === user?.id && (
          <Box display='flex' justifyContent='flex-end'>
            <IconButton
              aria-label='edit'
              onClick={() => setOpenEditShopDialog(true)}
            >
              <EditIcon />
            </IconButton>
          </Box>
        )}
        <ConfirmDialog
          open={openEditShopDialog}
          title='Edit shop'
          onClose={handleCloseEditShopDialog}
          onConfirm={handleConfirmEditShop}
          maxWidth='md'
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='name'
            name='name'
            label='Name of the Shop'
            value={editableShop.name}
            sx={{ mb: 3 }}
            onChange={(e) =>
              setEditableShop((prevShop) => ({
                ...prevShop,
                name: e.target.value,
              }))
            }
          />

          <TextField
            margin='normal'
            required
            fullWidth
            id='address'
            name='address'
            label='Address of the Shop'
            value={editableShop.address}
            onChange={(e) =>
              setEditableShop((prevShop) => ({
                ...prevShop,
                address: e.target.value,
              }))
            }
          />

          <TextField
            required
            fullWidth
            disabled
            id='country'
            name='country'
            label='Country of the Shop'
            sx={{ mt: 1 }}
            value={editableShop.country}
            onChange={(e) =>
              setEditableShop((prevShop) => ({
                ...prevShop,
                country: e.target.value,
              }))
            }
            helperText='Determined by the location on map you pick'
          />
          <Box
            display='flex'
            width='100%'
            justifyContent='flex-start'
            sx={{ mb: 2 }}
          >
            <Button
              variant='contained'
              color='secondary'
              sx={{ mt: 1 }}
              onClick={() => setOpenMap(true)}
            >
              Select shop location
            </Button>
          </Box>
          <MapSearchDialog
            open={openMap}
            title={'Select your shop location'}
            onClose={() => setOpenMap(false)}
            onSubmit={handleMapSubmit}
          />
        </ConfirmDialog>
      </CardContent>
    </Card>
  );
};
