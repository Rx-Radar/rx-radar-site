"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, OverlayViewF, OverlayView, Marker, InfoWindow, LoadScript, useLoadScript, MarkerProps } from '@react-google-maps/api';
import Link from 'next/link';

export default async function ZynRadar() {
  //const res = await fetch(`http://localhost:3000/api/zyn-get-store`, { cache: 'no-store' }); // dev
  const res = await fetch(`http://rx-radar.com/api/zyn-get-store`, { cache: 'no-store' }); // production
  const data = await res.json();

  return <div className="absolute top-0 left-0 right-0 bottom-0">

      {/* header bar */}
      <div className="w-full, p-2 bg-[#f9f4f4] flex flex-row justify-between">
        <img
        style={{width: 254, height: 53}}
        src="/zynlogo.png"
        alt="Zyn Radar"
        className="object-cover w-full h-full filter"
        /> 

        <Link href="/" className="px-6 py-3 bg-transparent border border-[#F94D00] rounded-full text-[#F94D00] font-semibold hover:bg-black hover:border-black hover:text-white transition duration-300 mx-auto sm:mx-0">
        Cant find your ADHD meds?
        </Link>
      </div>

      {/* map */}
      <MapComponent stores={data.stores}/>
  </div>
};

type Store = {
    name: string; 
    lat: number;
    lon: number;
    address: string;
    phone: string;
    availability: string;
};


type MapComponentProps = {
    stores: Store[];
  };

const MapComponent: React.FC<MapComponentProps> = ({ stores }) => {
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({lat: 37.0902, lng: -95.7129});
    const mapRef = useRef<google.maps.Map | null>(null);
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBfDFCXPpLFBFdRnWwgDATJpyl_mgu9VZU',
      });

    const customIcon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: 40,
    };

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const panToMarker = useCallback((store: Store) => {
        if (mapRef.current) {
            mapRef.current.panTo({lat: store.lat, lng: store.lon});
        }
    }, []);

    // update store location
    const onSelectStore = (store: Store) => {
        setSelectedStore(store);
        panToMarker(store);
    }


    return <div className="w-full h-full overflow-hidden">
        { isLoaded && <GoogleMap
        mapContainerStyle={{ height: '100%', width: '100%' }}
        center={mapCenter}
        zoom={5}
        onLoad={onMapLoad}
        options={mapStyles}
        >
            {/* display selected store information */}
            {selectedStore && (
            <InfoWindow
            position={{ lat: selectedStore.lat+0.0003, lng: selectedStore.lon }}
            onCloseClick={() => setSelectedStore(null)}
            >
                {/* store result content */}
                <div className="space-y-2">
                  { (selectedStore.availability == "in-stock") ?
                    <>
                      {/* zyn availability - available */}
                      <div className="flex flex-row rounded-md items-center space-x-1">
                          <img
                          style={{width: 24, height: 24}}
                          src="/zyn-available.png"
                          alt="Zyn Radar"
                          className="object-cover w-full h-full filter"
                          /> 
                          <p className="font-medium text-lg">Available</p>
                      </div>

                      <div>
                        <h2>{selectedStore.name}</h2>
                        <p>Address: {selectedStore.address}</p>
                        <p>Phone: {selectedStore.phone}</p>
                      </div>
                    </> :
                    <>
                      {/* zyn availability - unavailable */}
                      <div className="flex flex-row rounded-md items-center space-x-1">
                          <img
                          style={{width: 24, height: 24}}
                          src="/zyn-unavailable.png"
                          alt="Zyn Radar"
                          className="object-cover w-full h-full filter"
                          /> 
                          <p className="font-medium text-lg">Unavailable</p>
                      </div>

                      <div>
                        <h2>{selectedStore.name}</h2>
                        <p>Address: {selectedStore.address}</p>
                        <p>Phone: {selectedStore.phone}</p>
                      </div>
                    </>

                  }
                </div>
            </InfoWindow>
            )}

            {/* display zyn store pins */}
            {stores.map((store, index) => 
                { return (store.availability == "") ?
                <Marker
                key={index}
                position={{ lat: store.lat, lng: store.lon }}
                onClick={() => onSelectStore(store)}
                icon={{
                    url: '/zyn-available.png',
                    scaledSize: new window.google.maps.Size(30, 30), // Adjust the size as needed
                }}
                /> :
                <Marker
                key={index}
                position={{ lat: store.lat, lng: store.lon }}
                onClick={() => onSelectStore(store)}
                icon={{
                    url: '/zyn-unavailable.png',
                    scaledSize: new window.google.maps.Size(30, 30), // Adjust the size as needed
                }}
                />
            }
            )}
            
        </GoogleMap> }
    </div>
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
  mapTypeControl: false, // Removes the map/satellite toggle
  streetViewControl: false, // Removes the Street View pegman
  fullscreenControl: true, // Removes the fullscreen toggle
  disableDefaultUI: true
};