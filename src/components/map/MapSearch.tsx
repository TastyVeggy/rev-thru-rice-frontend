import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../features/store';
import { fetchCountries } from '../../features/slices/countriesSlice';
import 'leaflet-control-geocoder';

interface MapSearchProps {
  allowedCountries?: string[];
  onSubmit: (
    newLat: number,
    newLng: number,
    newCountry: string,
    newAddress: string | null
  ) => void;
}

// Shamelessly adapted from chatgpt
export const MapSearch: React.FC<MapSearchProps> = ({ onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: countries, status: countriesStatus } = useSelector(
    (state: RootState) => state.countries
  );
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [allowedCountries, setAllowedCountries] = useState<string[]>([]);
  const geocoderAddedRef = useRef(false);

  useEffect(() => {
    if (countriesStatus === 'idle') {
      dispatch(fetchCountries());
    }
  }, [dispatch, countriesStatus]);

  useEffect(() => {
    setAllowedCountries(countries.map((allowedCountry) => allowedCountry.name));
  }, [countries]);

  // Handle map click and geocoding
  const MapClickHandler = () => {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setPosition([lat, lng]);

        // Reverse geocoding to get address from lat/lng using Nominatim
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
          .then((res) => res.json())
          .then((data) => {
            setAddress(data.display_name || 'Address not found');
            setCountry(data.address.country || 'Country not found');
          })
          .catch((error) => {
            console.error('Error fetching address:', error);
          });
      },
    });
    return null;
  };

  // Handle geocoder control and location search
  const MapGeocoder = () => {
    const map = useMap(); // Accessing map instance with useMap()

    useEffect(() => {
      if (map && !geocoderAddedRef.current) {
        // const geocoder = L.Control.Geocoder.nominatim();

        // Create the geocoder control and add it to the map
        //hacky workaround because geocoder does not support typescript
        // const geocoder = (L.Control as any).Geocoder.nominatim();
        (L.Control as any)
          .geocoder({
            defaultMarkGeocode: false,
            collapsed: false,
            position: 'topleft',
          })
          .on('markgeocode', function (e: any) {
            const { lat, lng } = e.geocode.center;

            setPosition([lat, lng]);

            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            )
              .then((res) => res.json())
              .then((data) => {
                setAddress(data.display_name || 'Address not found');
                setCountry(data.address.country || 'Country not found');
              })
              .catch((error) => {
                console.error('Error fetching address:', error);
              });

            map.panTo([lat, lng]);
            setTimeout(() => {
              map.setZoom(12);
            }, 300);
          })
          .addTo(map);

        geocoderAddedRef.current = true;
      }

      // Use MutationObserver to watch for changes in geocoder results
      const observer = new MutationObserver(() => {
        const brElements = document.querySelectorAll(
          '.leaflet-control-geocoder-alternatives br'
        );
        brElements.forEach((br) => {
          const span = document.createElement('span');
          span.textContent = ', '; // Replace <br> with your custom separator (comma, hyphen, etc.)
          br.parentNode?.insertBefore(span, br); // Insert the new element before the <br> tag
          br.remove(); // Remove the <br> tag
        });
      });

      // Observe changes in the geocoder alternatives container
      const geocoderContainer = document.querySelector(
        '.leaflet-control-geocoder-alternatives'
      );
      if (geocoderContainer) {
        observer.observe(geocoderContainer, {
          childList: true, // Observe direct children (for added <br> tags)
          subtree: true, // Observe all descendants (for added elements inside children)
        });
      }

      // Cleanup observer when component unmounts
      return () => {
        if (geocoderContainer) {
          observer.disconnect();
        }
      };
    }, [map]); // Re-run the effect when map is available

    return null;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (position) {
      if (!allowedCountries || allowedCountries.includes(country)) {
        const [lat, lng] = position;
        onSubmit(lat, lng, country, address);
      } else {
        alert(
          'Your location must be in one of these countries: ' +
            allowedCountries.join(', ')
        );
      }
    } else {
      alert('Please click on the map to select a location first');
    }
  };

  return (
    <div>
      <MapContainer
        id='map'
        className='dynamic-map'
        center={[5.0, 105.0]}
        zoom={4}
        zoomControl={false}
      >
        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

        <MapClickHandler />

        <MapGeocoder />

        {position && (
          <Marker position={position}>
            <Popup>
              <div>
                <p>
                  <strong>Address:</strong> {address}
                </p>
                <p>
                  <strong>Country:</strong> {country}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <div style={{ marginTop: '20px' }}>
        <Button onClick={handleSubmit} variant='contained' disabled={!position}>
          Submit Location
        </Button>
      </div>
    </div>
  );
};
