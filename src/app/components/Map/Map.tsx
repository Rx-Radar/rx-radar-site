import React, { useEffect, useState } from 'react';
import styles from "./Map.module.css";

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { ping } from 'ldrs';
ping.register();

// define Pharmacy
interface Pharmacy {
    lon: string; 
    lat: string;
    name: string; 
}

// props for Map
interface MapProps {
    width: string;  // longitude
    height: string; // latitude
    pharmacies?: Pharmacy[]; // list of pharmacies
    error?: string; // map/location error if any
  }

export const Map: React.FC<MapProps> = ({ width, height, pharmacies, error }) => {
    const [center, setCenter] = useState({lat: 42.7284, lng: -73.687576});
    const [locationFetched, setLocationFetched] = useState(false);
      
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
  
    // this gets called on map click to counteract blue border around map
    const onMapClick = () => {
      const targetElement = document.querySelector('.gm-style iframe + div') as HTMLElement;
      if (targetElement) {
        targetElement.style.border = 'none'; 
      }
    };

    // return a loading screen while location loading
    if (!locationFetched || error) {
        return (
        <div style={{width, height, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
            <l-ping
            size="80"
            speed="2" 
            color="black" 
            ></l-ping>
            
            {/* if there is a user location error, display */}
            { error && 
            <p style={{backgroundColor: '#F5F5F5', color: 'black', fontSize: 18, display: 'flex', flexDirection: 'column', padding: 8, borderRadius: 6, alignItems: 'center', marginTop: 20}}>
                {error}
            </p>
            }
        </div>
        );
    } 

    // return map
    return (
        <LoadScript
        googleMapsApiKey="AIzaSyBfDFCXPpLFBFdRnWwgDATJpyl_mgu9VZU"
        >
            <GoogleMap
            mapContainerStyle={{width, height}}
            center={center}
            zoom={10}
            options={mapStyles}
            onClick={onMapClick}
            >
                {/* Child components like markers can be added here */}
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
  }