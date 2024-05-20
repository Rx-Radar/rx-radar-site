"use client";

import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, OverlayViewF, OverlayView } from '@react-google-maps/api';

// props for Map
interface MapProps {
    userLocation: { lat: number, lng: number }
    pharmacies: any[];
}

/**
 * Map: map pane and function
 * @param MapProps 
 * @returns React functional component
 */
export const Map: React.FC<MapProps> = ({ userLocation, pharmacies }) => {
  const [zoom, setZoom] = useState<number>(14);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyBfDFCXPpLFBFdRnWwgDATJpyl_mgu9VZU"
  });

  // on map clicked handler
  const onMapClick = () => {
    const targetElement = document.querySelector('.gm-style iframe + div') as HTMLElement;
    if (targetElement) {
      targetElement.style.border = 'none'; 
    }
  };

  const onZoomChanged = useCallback(() => {
    if (mapRef.current) {
      setZoom(mapRef.current.getZoom()!);
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setZoom(map.getZoom()!);
  }, []);

  const getOverlaySize = (zoom: number) => {
    // Adjust the base size and scaling factor as needed
    const baseSize = 5; // base size in rem
    const minSize = 4.3; // minimum size in rem
    const maxSize = 6.5; // maximum size in rem

    // Inverse the scale factor to make the overlay smaller when zooming in
    // and larger when zooming out
    const scaleFactor = Math.pow(2, (14 - zoom) / 4);

    // Calculate the size based on the scale factor
    const size = baseSize * scaleFactor;

    let displaySize = baseSize;
    if (size > maxSize) {
      displaySize = 0;
    } else {
      // Clamp the size between the minimum and maximum values
      displaySize = Math.max(minSize, Math.min(maxSize, size));
    }

    return {
      width: `${displaySize}rem`,
      height: `${displaySize}rem`,
      size: displaySize,
    };
  };

  const getPharmacyPin = (pharmacyCall: any, index: number) => {
    const pharmacy = pharmacyCall.pharmacy;

    if (overlaySize.size == 0) return; // do not return pharmacy if too zoomed out

    // return cvs pharmacy type
    if (pharmacy.pharmCode == "CVS") {
      return <OverlayViewF
      key={index}
      position={{lat: 41.1177, lng: -73.4082}}
      // position={{lat: pharmacy.lat, lng: pharmacy.lng}}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <div className="rounded-lg flex flex-col text-wrap bg-white border-[#F94D00] border-2 text-black" style={{ width: overlaySize.size*50, height: overlaySize.size*20, display: 'flex', transform: "translate(-50%,-50%)"}}>
          <div className="flex flex-row justify-between align-baseline p-2 items-center">
            {/* pharmacy logo */}
            <img
              src="https://images.ctfassets.net/nu3qzhcv2o1c/3CyvJzxfGmux150UrFIN9e/fb472412561df30a688a0b897c998cc0/cvs-logo.svg"
              alt="CVS Pharmacy Logo"
              style={{ height: 'auto', padding: 5}}
            />

            {/* color fillable info depdning on status */}
            { pharmacyCall.result == "fillable" ?
              <p className="text-green-500" style={{fontSize: overlaySize.size*3}}><b>In Stock</b></p> :
              <p className="text-red-500" style={{fontSize: overlaySize.size*3}}><b>Out/Uncertain</b></p>
            }
            
          </div>
        
          <div className="w-full pl-2 pr-2">
            <p style={{fontSize: overlaySize.size*2.3}}><b>address:</b> {pharmacy.address}</p>
            <p style={{fontSize: overlaySize.size*2.3}}><b>phone:</b> {pharmacy.phone}</p>
          </div>
        </div>
      </OverlayViewF>
    }
  }

  const overlaySize = getOverlaySize(zoom);

  return isLoaded && (
    <div className="md:w-2/3 text-white h-96 md:h-[calc(100vh-4rem)] overflow-hidden md:rounded-tl-xl">
      <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={userLocation}
        zoom={zoom}
        options={mapStyles}
        onClick={onMapClick}
        onLoad={onLoad}
        onZoomChanged={onZoomChanged}
      >

        {/* pharmacy pins */}
        {pharmacies.map((pharmacy, index) => {
          return getPharmacyPin(pharmacy, index)
        })}  

        {/* user location pin */}
        <OverlayViewF
        position={userLocation}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="rounded-full bg-[#FBCEB1]" style={{ width: overlaySize.width, height: overlaySize.height, display: 'flex', justifyContent: 'center', alignItems: 'center', transform: "translate(-50%,-50%)"}}>
            <div className="rounded-full bg-[#F94D00]" style={{ width: '40%', height: '40%' }}/>
          </div>
        </OverlayViewF>
      </GoogleMap>
    </div>
  );
};



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
  mapTypeControl: false, // Removes the map/satellite toggle
  streetViewControl: false, // Removes the Street View pegman
  fullscreenControl: true, // Removes the fullscreen toggle
  disableDefaultUI: true
};