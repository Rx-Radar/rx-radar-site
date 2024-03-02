'use client';

import styles from "./page.module.css";

import React, { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

import { collection, getDocs } from "firebase/firestore"; 
import { db } from './firebase-config';
import { Tooltip } from 'react-tooltip'

import { Map } from "./components/Map/Map";
import { Pharmacy } from "./components/Pharmacy/Pharmacy";
import { PharmacyResultCard } from "./components/PharmacySearch/PharmacyResultCard/PharmacyResultCard";


let _pharmacies: Pharmacy[] = [
  {id: 1, name: 'CVS Boylston', phone: '203-454-4564', location: {lat: 42.7284, lng: -73.587576}, selected: false}, 
  {id: 2, name: 'Wallgreens Brookline', phone: '203-454-4564', location: {lat: 42.8284, lng: -73.587576}, selected: false}, 
  {id: 3, name: 'CVS Norwalk', phone: '203-454-4564', location: {lat: 42.5284, lng: -73.787576}, selected: false}, 
  {id: 4, name: 'Duane Reade', phone: '203-454-4564', location: {lat: 42.5284, lng: -73.687576}, selected: false}, 
  {id: 5, name: 'CVS Allston', phone: '203-454-4564', location: {lat: 42.8284, lng: -73.787576}, selected: false}, 
  {id: 6, name: 'Wallgreens South End', phone: '203-454-4564', location: {lat: 42.8584, lng: -73.683576}, selected: false}
];


export default function Home() {
  const [locationError, setLocationError] = useState<string|undefined>(undefined); // stores user location error
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(_pharmacies); // store list of pharmacies in search
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy|undefined>();

  // handles selection and focusing of a pharmacy
  const onSelectPharmacy = (pharmacy?: Pharmacy) => {
    let updatedList: Pharmacy[]|undefined;

    if (pharmacy) {
      // update list of pharmacies with selected pharmacy
      updatedList = pharmacies.map(_pharmacy => ({
        ..._pharmacy, // Spread the existing properties
        selected: _pharmacy.id === pharmacy.id, 
      }));

      setSelectedPharmacy(pharmacy); // set selected pharmacy
    } else {
      // updated list of pharmacies to all be diselected
      // update list of pharmacies with selected pharmacy
      updatedList = pharmacies.map(_pharmacy => ({
        ..._pharmacy, // Spread the existing properties
        selected: false, 
      }));

      setSelectedPharmacy(undefined); // set selected pharmacy to be nothing
    }

    setPharmacies(updatedList); // update list 


  }

  useEffect(() => {
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

      <div style={{height: '100vh', width: '40vw', flexDirection: 'column', placeItems: 'center', display: 'flex', padding: 10}}>

        {/* title */}
        <div style={{justifyContent: 'space-between', display: 'flex', alignItems: 'center', width: '100%'}}>
          <h1 style={{color: 'black', width: 'fit-content'}}>Rx-Radar</h1>
          <div style={{display: 'flex', width: 'fit-content', gap: 10, alignItems: 'center'}}>
            <h3 style={{color: 'black', width: 'fit-content'}}>About</h3>
          </div>
        </div>

        {/* page divider */}
        <div style={{height: 3, width: '100%', borderRadius: 1, marginTop: 10, backgroundColor: '#F5F5F5'}}/>

        {/* search */}
        <div style={{marginTop: 15, gap: 10, display: 'flex', justifyContent: 'start', width: '100%'}}>

          {/* medication text input */}
          <input type="text" placeholder="Search for medication..." className={styles.searchInput} style={{width: '50%'}}/>

          {/* location text input box */}
          <a data-tooltip-id="my-tooltip" data-tooltip-content="Check back soon, we're adding new locations.">
            <div style={{display: 'inline-flex', padding: 10, paddingRight: 50, borderRadius: 5, backgroundColor: '#F5F5F5', alignItems: 'center', outline: 'none' }}>

              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <p style={{fontSize: 16, color: 'black', marginLeft: 5}}>Troy, NY</p>
              <Tooltip id="my-tooltip" />
            </div>
          </a>

          <button className={styles.newButton}>Search</button>
        </div>

        {/* search results title */}
        <div style={{display: 'flex', width: '100%', marginTop: 15}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <h3 style={{color: 'black'}}>4 Results for</h3>  
            <div style={{backgroundColor: '#F5F5F5', padding: 8, marginLeft: 5, color: '#AA98A9', fontWeight: '700', borderRadius: 7}}>Adderall</div>
            <h3 style={{marginLeft: 5, color: 'black'}}>within</h3>
            <div style={{backgroundColor: '#F5F5F5', padding: 8, marginLeft: 5, color: '#AA98A9', fontWeight: '700', borderRadius: 7}}>5 mi</div>
          </div>
        </div>


        {/* page divider */}
        <div style={{height: 3, width: '100%', borderRadius: 1, marginTop: 15, backgroundColor: '#F5F5F5',}}/>
        
        {/* search results scroll view*/}
        { selectedPharmacy ? 
          <div style={{height: '100%', border: '2px solid #F2F3F4', width: '100%', borderRadius: 10, paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, marginTop: 20, display: 'flex', flexDirection: 'column'}}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center', alignItems: 'center'}}>
              <svg onClick={() => onSelectPharmacy()} style={{justifySelf: 'flex-start'}} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2 style={{color: 'black', width: '100%'}}>{selectedPharmacy.name}</h2>
            </div>
          </div> :
          <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, overflowY: 'scroll', scrollbarWidth: 'none'}}>
            {pharmacies.map((pharmacy) => (
              <PharmacyResultCard key={pharmacy.id} pharmacy={pharmacy} pharmacyCardSelect={onSelectPharmacy}/>
            ))}
          </div>

        }
        
      </div>

      {/* map componenet */}
      <Map height="100vh" width="80vw" pharmacies={pharmacies} selectPharmacy={onSelectPharmacy} error={locationError}/>
      
      {/* location elements floating over map */}
      <div style={{position: 'absolute', top: 20, left: '34vw', zIndex: 10000, flexDirection: 'column'}}>

        {/* location testing disclaimer */}
        <p style={{backgroundColor: 'black', color: 'white', fontSize: 10, display: 'flex', flexDirection: 'column', padding: 6, borderRadius: 6, alignItems: 'center'}}>
        * Currently Rx-Radar only works in Troy and adjacent towns
        </p>

        {/* current location tag */}
        <div style={{backgroundColor: 'black', padding: 8, borderRadius: 10, display: 'inline-flex', marginTop: 8}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.7221 8.26596C15.2107 8.10312 15.4549 8.02169 15.6174 8.07962C15.7587 8.13003 15.87 8.24127 15.9204 8.38263C15.9783 8.54507 15.8969 8.78935 15.734 9.27789L14.2465 13.7405C14.2001 13.8797 14.1769 13.9492 14.1374 14.007C14.1024 14.0582 14.0582 14.1024 14.007 14.1374C13.9492 14.1769 13.8797 14.2001 13.7405 14.2465L9.27789 15.734C8.78935 15.8969 8.54507 15.9783 8.38263 15.9204C8.24127 15.87 8.13003 15.7587 8.07962 15.6174C8.02169 15.4549 8.10312 15.2107 8.26596 14.7221L9.75351 10.2595C9.79989 10.1203 9.82308 10.0508 9.8626 9.99299C9.8976 9.94182 9.94182 9.8976 9.99299 9.8626C10.0508 9.82308 10.1203 9.79989 10.2595 9.75351L14.7221 8.26596Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{paddingLeft: 5, fontSize: 16, fontWeight: '500', color: 'white'}}>Troy, NY</p>
        </div>
      </div>
      
    </main>
  );
}

