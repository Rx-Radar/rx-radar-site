'use client';

import React, { useEffect, useState, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import Head from 'next/head';
import { NextPage } from 'next';
import { NavigationBar } from '../../../components/NavigationBar/NavigationBar';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoib2RvbGFuIiwiYSI6ImNsd3U2anFuZTBibmEyaXE1cHowY2IzcWUifQ.Jyo1DMVIDkdx5wmg5xIA0Q';
const ZOOM_THRESHOLD = 14; // Set the zoom level threshold

const MapPage: NextPage = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 14,
  });
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [cachedPharmacies, setCachedPharmacies] = useState<any[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<any | null>(null);
  const [lastLoadedPosition, setLastLoadedPosition] = useState<{ latitude: number; longitude: number }>({ latitude: 40.7128, longitude: -74.0060 });
  const [isButtonGlowing, setIsButtonGlowing] = useState(false);

  const [isMenuVisible, setMenuVisible] = useState(true);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const fetchPharmacies = useCallback(
    debounce(async (latitude: number, longitude: number) => {
      console.log('debounced and making new call')
      try {
        const response = await fetch(`/api/pull_pharmacies?latitude=${latitude}&longitude=${longitude}`);

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status === 'OK') {
          setCachedPharmacies((prevPharmacies) => {
            const newPharmacies = data.results.filter((newPharmacy: any) =>
              !prevPharmacies.some((existingPharmacy: any) => existingPharmacy.place_id === newPharmacy.place_id)
            );
            return [...prevPharmacies, ...newPharmacies];
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching pharmacies:', error.message);
        } else {
          console.error('An unknown error occurred while fetching pharmacies');
        }
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (viewport.zoom >= ZOOM_THRESHOLD) {
      const { latitude, longitude } = viewport;
      fetchPharmacies(latitude, longitude);
      setLastLoadedPosition({ latitude, longitude });
    }
  }, []);

  useEffect(() => {
    const distanceLat = Math.abs(viewport.latitude - lastLoadedPosition.latitude);
    const distanceLng = Math.abs(viewport.longitude - lastLoadedPosition.longitude);
    setIsButtonGlowing(distanceLat > 0.05 || distanceLng > 0.05);
  }, [viewport, lastLoadedPosition]);

  useEffect(() => {
    setPharmacies(
      cachedPharmacies.filter(
        (pharmacy) =>
          Math.abs(pharmacy.geometry.location.lat - viewport.latitude) < 0.1 &&
          Math.abs(pharmacy.geometry.location.lng - viewport.longitude) < 0.1
      )
    );
  }, [cachedPharmacies, viewport]);

  const handleLoadMorePharmacies = () => {
    const { latitude, longitude } = viewport;
    fetchPharmacies(latitude, longitude);
    setLastLoadedPosition({ latitude, longitude });
    setIsButtonGlowing(false);
  };

  return (
    <>
      <Head>
        <title>Pharmacy Map</title>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div className="h-screen w-screen flex flex-col">

        <button
          onClick={toggleMenu}
          className="absolute top-20 left-24 z-10 p-2 bg-blue-500 text-white rounded-md"
        >
          Toggle Menu
        </button>

        <Header />

        <div className="flex h-full">

          <div
            className={`transition-all overflow-hidden duration-300 transform bg-gray-100 ${
              isMenuVisible ? 'w-1/4' : 'w-0'
            }`}
          >
            {/* Your content here */}
            <p>sdfsdf</p>
          </div>

          <div
            className={`flex-grow transition-all duration-300 bg-blue-500 ${
              isMenuVisible ? 'w-3/4' : 'w-full'
            }`}
          >
            <Map
              {...viewport}
              style={{ width: '100vw', height: '100%' }}
              mapStyle="mapbox://styles/odolan/clwunwyv100bf01qp8alydbvn"
              mapboxAccessToken={MAPBOX_TOKEN}
              onClick={() => setSelectedPharmacy(null)}
              onMove={(evt) =>
                setViewport({
                  latitude: evt.viewState.latitude,
                  longitude: evt.viewState.longitude,
                  zoom: evt.viewState.zoom,
                })
              }
            >
              <NavigationControl position="bottom-left" />

              {pharmacies.map((pharmacy) => (
                <Marker
                  key={pharmacy.place_id}
                  latitude={pharmacy.geometry.location.lat}
                  longitude={pharmacy.geometry.location.lng}
                  onClick={() => {
                    selectedPharmacy === pharmacy ? setSelectedPharmacy(null) : setSelectedPharmacy(pharmacy);
                  }}
                >
                  <div className="bg-black p-2 rounded-full cursor-pointer">
                    <span role="img" aria-label="pharmacy">
                      💊
                    </span>
                  </div>
                </Marker>
              ))}

              {selectedPharmacy && (
                <Popup
                  latitude={selectedPharmacy.geometry.location.lat}
                  longitude={selectedPharmacy.geometry.location.lng}
                  onClose={() => setSelectedPharmacy(null)}
                  closeOnClick={false}
                  className="space-x-10 space-y-10"
                  closeButton={false}
                >
                  <div className="h-1/4 flex flex-col max-w-1/2">
                    <p className="text-md font-bold">{selectedPharmacy.name}</p>
                    <p>{selectedPharmacy.vicinity}</p>

                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <p>Available</p>
                    </div>
                  </div>
                </Popup>
              )}
            </Map>
          </div>
        </div>


        {/* call detail badge
        <div 
          className="absolute right-0 top-20 px-3 py-20 w-1/4 min-w-80  bg-white shadow-lg rounded-tl-md rounded-bl-md stroke-black flex flex-row "
        >
          <p>
            Search Details
          </p>

        </div> */}

        {/* back button */}
        <button
          onClick={() => {}}
          className="absolute left-8 top-20 py-2 px-4  bg-white rounded-full shadow-lg stroke-black hover:stroke-white hover:bg-black hover:text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 7H14C17.3137 7 20 9.68629 20 13C20 16.3137 17.3137 19 14 19H4M4 7L8 3M4 7L8 11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        {/* show more pharmacies button */}
        <button
          onClick={handleLoadMorePharmacies}
          className={classNames(
            "absolute bottom-6 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded-full shadow-lg hover:bg-black hover:text-white",
            isButtonGlowing ? "bg-black text-white": "bg-white text-black"
          )}
        >
          Load More Pharmacies
        </button>
      </div>
    </>
  );
};

export default MapPage;



const Header = () => {
  return (
    <div className="w-full text-white bg-transparent px-5 py-3 z-10 flex flex-row justify-between space-x-2 items-center">
      {/* logo */}
      <img
      style={{width: 137, height: 31}}
      src="/textlogo.png"
      alt="Boston Map"
      className="object-cover w-full h-full filter"
      /> 

      <div className='flex flex-row text-[#F94D00] stroke-[#F94D00] font-thin, bg-[#E5E4E2] p-2 rounded-full'>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M15 9H15.01M9 9H9.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9ZM9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      {/* <div className="w-full bg-slate-200 flex flex-row justify-center">
      
      </div> */}
    </div>
  );
}