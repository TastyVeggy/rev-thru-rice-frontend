import { Box } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  lat: number;
  lng: number;
  address: string | null;
}

export const Map: React.FC<MapProps> = ({ lat, lng, address }: MapProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={9}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
        <Marker position={[lat, lng]}>
          {address && <Popup>{address}</Popup>}
        </Marker>
      </MapContainer>
    </Box>
  );
};
