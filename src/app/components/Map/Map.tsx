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
    if (!pharmacy.selected) {
      event.stopPropagation(); // stops the click from causing a map selection
    }

    // center the selected pin on the map
    if (map) {
      const pin = new window.google.maps.LatLng(pharmacy.location.lat, pharmacy.location.lng);
      map.panTo(pin);
    }
    // select Pharmacy
    selectPharmacy(pharmacy);
  }

  // return a loading screen while location loading or if there is a location related error
  if (!locationFetched || !isLoaded || error) {
    return (
      <div style={{width, height, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', marginRight: 12,}}>
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
    <div style={{width, height, marginRight: 12, marginTop: 0, display: 'flex', justifyContent: 'center'}}>
      <GoogleMap
      mapContainerStyle={{height, width: '100%', borderRadius: 10}}
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

      {/* location elements floating over map */}
      <div style={{position: 'absolute', top: 70, left: '31vw', zIndex: 10000, flexDirection: 'column'}}>

        {/* location testing disclaimer */}
        {/* <p style={{backgroundColor: 'black', color: 'white', fontSize: 10, display: 'flex', flexDirection: 'column', padding: 6, borderRadius: 6, alignItems: 'center'}}>
        * Currently Rx-Radar only works in Troy and adjacent towns
        </p> */}

        {/* current location tag */}
        <div style={{backgroundColor: 'black', padding: 8, borderRadius: 10, display: 'inline-flex', marginTop: 8}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.7221 8.26596C15.2107 8.10312 15.4549 8.02169 15.6174 8.07962C15.7587 8.13003 15.87 8.24127 15.9204 8.38263C15.9783 8.54507 15.8969 8.78935 15.734 9.27789L14.2465 13.7405C14.2001 13.8797 14.1769 13.9492 14.1374 14.007C14.1024 14.0582 14.0582 14.1024 14.007 14.1374C13.9492 14.1769 13.8797 14.2001 13.7405 14.2465L9.27789 15.734C8.78935 15.8969 8.54507 15.9783 8.38263 15.9204C8.24127 15.87 8.13003 15.7587 8.07962 15.6174C8.02169 15.4549 8.10312 15.2107 8.26596 14.7221L9.75351 10.2595C9.79989 10.1203 9.82308 10.0508 9.8626 9.99299C9.8976 9.94182 9.94182 9.8976 9.99299 9.8626C10.0508 9.82308 10.1203 9.79989 10.2595 9.75351L14.7221 8.26596Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{paddingLeft: 5, fontSize: 16, fontWeight: '500', color: 'white'}}>Troy, NY</p>
        </div>
      </div>
    </div>
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