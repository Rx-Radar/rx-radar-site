'use client';

import styles from "./page.module.css";

import React, { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

import { collection, getDocs } from "firebase/firestore"; 
import { db } from './firebase-config';
import { Tooltip } from 'react-tooltip'

import { Map } from "./components/Map/Map";


let results = [{name: 'CVS Boylston'}, {name: 'Wallgreens Brookline'}, {name: 'CVS Norwalk'}, {name: 'Duane Reade'}, {name: 'CVS Allston'}, {name: 'Wallgreens South End'}];

// HARDCODED LOCATION 
// const defaultLocation = {lat: 42.7284, lng: -73.687576}; // troy, new york
const defaultLocation = {lat: 42.3601, lng: -71.0589}; // Boston, MA


export default function Home() {

  const [locationError, setLocationError] = useState<string|undefined>(undefined); // stores user location error

  // checks user location permissions on website load
  const checkUserLocationPermissions = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('this position',position);

        const { latitude, longitude } = position.coords;

        const distanceInMeters = getDistance(
          { latitude: defaultLocation.lat, longitude: defaultLocation.lng },
          { latitude: latitude, longitude: longitude }
        );
        const distanceFromDefaultLocation = distanceInMeters * 0.000621371; // Convert meters to miles
        
        // set an error if the user is out of range of the default location
        let MAX_DISTANCE_IN_MILES = 50;
        if (distanceFromDefaultLocation > MAX_DISTANCE_IN_MILES) {
          setLocationError('Please note currently Rx-Radar only supports users in Troy');
        } else {
          // disable location error
          setLocationError(undefined);
        } 
      },
      (error) => setLocationError('Rx-Radar requires location access from your browser to continue.')
    );
  }

  useEffect(() => {

    // navigator.permissions.query({ name: 'geolocation' }).then(function(permissionStatus) {
    //   console.log('geolocation permission state is ', permissionStatus.state);
    //   permissionStatus.onchange = () => {
    //     console.log(permissionStatus.state);
    //   }
    // });

    checkUserLocationPermissions();

    // const fetchResults = async () => {
    //   const querySnapshot = await getDocs(collection(db, "pharmacies"));
    //   querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} => ${doc.data()}`);
    //   });
    // }

    // fetchResults();
  }, []);

  return (
    <main className={styles.main}>

      <div style={{height: '100vh', width: '40vw', flexDirection: 'column', placeItems: 'center', display: 'flex', padding: 15}}>

        {/* title */}
        <div style={{justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%'}}>
          <h1 style={{color: 'black', width: 'fit-content'}}>Rx-Radar</h1>
          <div style={{display: 'flex', width: 'fit-content', gap: 10, alignItems: 'center'}}>
            <h3 style={{color: 'black', width: 'fit-content'}}>About</h3>
          </div>
        </div>

        <div style={{height: 3, width: '100%', borderRadius: 1, marginTop: 10, backgroundColor: '#F5F5F5'}}/>

        {/* search */}
        <div style={{marginTop: 15, gap: 10, display: 'flex', justifyContent: 'start', width: '100%'}}>

          {/* medication text input */}
          <input type="text" placeholder="Search for medication..." className={styles.searchInput} style={{width: '60%'}}/>

          {/* location text input box */}
          <a data-tooltip-id="my-tooltip" data-tooltip-content="Check back soon, we're adding new locations.">
            <div className={styles.searchInput}>
              <input disabled={true} type="text" placeholder="Search town..." value={'Troy, NY'} className={styles.searchInput} style={{width: '10%'}}/>
              <Tooltip id="my-tooltip" />
            </div>
          </a>

          <button className={styles.newButton}>Search</button>

        </div>

        <div style={{display: 'flex', width: '100%', marginTop: 15}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <h3 style={{color: 'black'}}>4 Results for</h3>  
            <div style={{backgroundColor: '#F5F5F5', padding: 8, marginLeft: 5, color: '#AA98A9', fontWeight: '700', borderRadius: 7}}>Adderall</div>
            <h3 style={{marginLeft: 5, color: 'black'}}>within</h3>
            <div style={{backgroundColor: '#F5F5F5', padding: 8, marginLeft: 5, color: '#AA98A9', fontWeight: '700', borderRadius: 7}}>5 mi</div>
          </div>
        </div>


        <div style={{height: 3, width: '100%', borderRadius: 1, marginTop: 15, backgroundColor: '#F5F5F5',}}/>
        
        {/* results */}
        <div style={{width: '95%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, overflowY: 'scroll', scrollbarWidth: 'none'}}>
          {results.map((item, index) => (
            <div key={index} style={{ width: '100%', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15}}>
              
              <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                <div style={{flexDirection: 'column', display: 'flex'}}>
                  <h3 style={{color: 'black'}}>{item.name}</h3>
                  <p style={{fontSize: 15, fontWeight: '500', color: 'grey', marginTop: 2}}>(617) 266-6775</p>
                </div>

                <div style={{alignItems: 'center'}}>
                  <p style={{backgroundColor: '#AA98A9', padding: 5, borderRadius: 8, fontWeight: '600', color: 'white'}}>5 mi</p>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                <div className={styles.circlePulse}/>
                <p style={{color: 'black', marginLeft: 5}}>available</p>
              </div>
                    
            </div>
          ))}
        </div>
        
      </div>

      {/* map componenet */}
      <Map height="100vh" width="60vw" error={locationError}/>
      
      <div style={{position: 'absolute', top: 20, left: '41vw', zIndex: 10000, flexDirection: 'column'}}>
        <p style={{backgroundColor: 'black', color: 'white', fontSize: 10, display: 'flex', flexDirection: 'column', padding: 6, borderRadius: 6, alignItems: 'center'}}>
        * Currently Rx-Radar only works in Troy and adjacent towns
        </p>

        <div style={{backgroundColor: 'black', padding: 8, borderRadius: 10, display: 'inline-flex', marginTop: 8}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14.7221 8.26596C15.2107 8.10312 15.4549 8.02169 15.6174 8.07962C15.7587 8.13003 15.87 8.24127 15.9204 8.38263C15.9783 8.54507 15.8969 8.78935 15.734 9.27789L14.2465 13.7405C14.2001 13.8797 14.1769 13.9492 14.1374 14.007C14.1024 14.0582 14.0582 14.1024 14.007 14.1374C13.9492 14.1769 13.8797 14.2001 13.7405 14.2465L9.27789 15.734C8.78935 15.8969 8.54507 15.9783 8.38263 15.9204C8.24127 15.87 8.13003 15.7587 8.07962 15.6174C8.02169 15.4549 8.10312 15.2107 8.26596 14.7221L9.75351 10.2595C9.79989 10.1203 9.82308 10.0508 9.8626 9.99299C9.8976 9.94182 9.94182 9.8976 9.99299 9.8626C10.0508 9.82308 10.1203 9.79989 10.2595 9.75351L14.7221 8.26596Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p style={{paddingLeft: 5, fontSize: 16, fontWeight: '500', color: 'white'}}>Troy, NY</p>
        </div>
      </div>
      
    </main>
  );
}

