import React, { useEffect, useState, useRef } from 'react';
import styles from "./Map.module.css";

import { GoogleMap, LoadScript, useJsApiLoader } from '@react-google-maps/api';
import { PharmacyPin } from '../Pharmacy/PharmacyPin';

// import { ping } from 'ldrs';
import PulseLoader from "../LoaderAnimations/PulseLoader/PulseLoader";
import { Pharmacy } from '../Pharmacy/Pharmacy';

// props for Map
interface MapProps {
    width: string;  // longitude
    height: string; // latitude
    pharmacies: Pharmacy[]; // list of pharmacies
    error?: string; // map/location error if any
    selectPharmacy: (pharmacy?: Pharmacy) => void;
}

export const Map: React.FC<MapProps> = ({ width, height, pharmacies, error, selectPharmacy }) => {
  const [center, setCenter] = useState({lat: 42.7284, lng: -73.687576});
  const [locationFetched, setLocationFetched] = useState(false);
  const [map, setMap] = useState<google.maps.Map>(); // map ref

  // loads google map
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBfDFCXPpLFBFdRnWwgDATJpyl_mgu9VZU"
  });

      
  // useEffect which sets map zoom to include all loaded pharmacies
  useEffect(() => {
    if (isLoaded && map) {
      const bounds = new google.maps.LatLngBounds();
  
      pharmacies.forEach(pharmacy => {
        const position = new google.maps.LatLng(pharmacy.location.lat, pharmacy.location.lng);
        bounds.extend(position);
      });
      map.fitBounds(bounds);
    }
  }, [isLoaded, map]);
  
  // general use effect
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationFetched(true);
        },
        () => {
          console.log("Error getting location");
          setLocationFetched(true); // Ensure map is rendered even if location fetch fails
        }
      );
    }
  }, []);
  
  // on map clicked handler
  const onMapClick = () => {
    // counteracts the blue border around google map
    // PLEASE NOTE THIS SHOULD GET FIXED IN A GOOGLE_MAPS_API UPDATE EVENTUALLY
    const targetElement = document.querySelector('.gm-style iframe + div') as HTMLElement;
    if (targetElement) {
      targetElement.style.border = 'none'; 
    }

    selectPharmacy(); // call select pharmacy with no pharmacy
  };

  // on pharmacy pin select
  const onPharmacyPinClick = (pharmacy: Pharmacy, event: any) => {
    event.stopPropagation(); // stops the click from causing a map selection

    // center the selected pin on the map
    if (map) {
      const pin = new window.google.maps.LatLng(pharmacy.location.lat, pharmacy.location.lng);
      map.panTo(pin);
    }
    // select Pharmacy
    selectPharmacy(pharmacy);
  }

  // return a loading screen while location loading or if there is a location related error
  if (!locationFetched || error) {
    return (
      <div style={{width, height, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
        <PulseLoader/>
            
        {/* if there is a user location error, display */}
        { error && 
          <p style={{backgroundColor: '#F5F5F5', color: 'black', fontSize: 18, display: 'flex', flexDirection: 'column', padding: 8, borderRadius: 6, alignItems: 'center', marginTop: 20}}>
            {error}
          </p>
        }
      </div>
      );
  } 

  // return the map component
  return isLoaded && (
    <GoogleMap
    mapContainerStyle={{width, height}}
    center={center}
    zoom={10}
    options={mapStyles}
    onClick={onMapClick}
    onLoad={(map) => setMap(map)}
    >
      {/* pharmacy pins */}
      {pharmacies.map((pharmacy) => {
        return <PharmacyPin key={pharmacy.id} pharmacy={pharmacy} onPharmacyPinClick={onPharmacyPinClick}/>
      })}        
    </GoogleMap>
  );
} 


// google maps style parameter
const mapStyles = {
  styles: [
      {
      featureType: "poi",
      elementType: 'labels',
      stylers: [{ visibility: "off" }]
      },
      {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [
          {
          visibility: 'off' // Hide transit labels
          }
      ]
      },
      {
      featureType: 'administrative',
      elementType: 'labels',
      stylers: [
          {
          visibility: 'off' // Hide administrative labels
          }
      ]
      },
      {
      featureType: 'road.highway',
      elementType: 'labels',
      stylers: [
          {
          visibility: 'off' // Hide highway labels
          }
      ]
      },
      // You can add more styles here
  ],
  restriction: {
      // sets the bounds hardcoded to Troy, NY
      latLngBounds: {
          north: 43.0, // Upper bound
          south: 42.4, // Lower bound
          west: -74.0, // Left bound
          east: -73.1 // Right bound
      },
      strictBounds: false // Set to true if you want to strictly enforce the bounds
  },
  mapTypeControl: false, // Removes the map/satellite toggle
  streetViewControl: false, // Removes the Street View pegman
  fullscreenControl: false, // Removes the fullscreen toggle
};