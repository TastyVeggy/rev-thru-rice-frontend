import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Button } from '@mui/material';

interface MapProps {
  allowedCountries?: string[];
  onSubmit: (
    newLat: number,
    newLng: number,
    newCountry: string,
    newAddress: string | null
  ) => void;
}

// Shamelessly adapted from chatgpt
export const Map: React.FC<MapProps> = ({ allowedCountries, onSubmit }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const geocoderAddedRef = useRef(false); // Track if geocoder is added

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
        const geocoder = L.Control.Geocoder.nominatim();

        // Create the geocoder control and add it to the map
        L.Control.geocoder({
          geocoder,
          collapsed: false,
          position: 'topleft',
        }).addTo(map);

        // Mark that the geocoder has been added
        geocoderAddedRef.current = true;

        // Attach an event listener to capture the geosearch/showlocation event
        map.on('geosearch/showlocation', function (e: any) {
          const latlng = e.latlng;
          setPosition([latlng.lat, latlng.lng]);

          // Reverse geocode to get address
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              setAddress(data.display_name || 'Address not found');
              setCountry(data.address.country || 'Country not found');
            })
            .catch((error) => {
              console.error('Error fetching address:', error);
            });
        });
      }

      // Use MutationObserver to watch for changes in geocoder results
      const observer = new MutationObserver(() => {
        const brElements = document.querySelectorAll(
          '.leaflet-control-geocoder-alternatives br'
        );
        brElements.forEach((br) => {
          const span = document.createElement('span');
          span.textContent = ', '; // Replace <br> with your custom separator (comma, hyphen, etc.)
          br.parentNode.insertBefore(span, br); // Insert the new element before the <br> tag
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
        console.log(country);
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
        style={{ height: '500px', width: '100%' }}
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

export default Map;
