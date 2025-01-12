import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MapSearch } from '../map/MapSearch';

interface MapSearchDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (
    newLat: number,
    newLng: number,
    newCountry: string,
    newAddress: string | null
  ) => void;
}

export const MapSearchDialog: React.FC<MapSearchDialogProps> = ({
  open,
  title,
  onClose,
  onSubmit,
}) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby='map-dialog'
      open={open}
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
          {title}
        </Typography>
        <IconButton edge='end' color='primary' onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography color='#FF0000' sx={{ mb: 2 }}>
          Note: Even though using the search function will add a marker, you
          yourself will have to click a point on the map before submitting
          location
        </Typography>
        <MapSearch onSubmit={onSubmit} />
      </DialogContent>
    </BootstrapDialog>
  );
};
