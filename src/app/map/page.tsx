'use client';

import styles from "./page.module.css";

import React, { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

import { Tooltip } from 'react-tooltip'

import { Map, focusMapOnPharmacy } from "../../../components/Map/Map";
import { Pharmacy } from "../../../components/Pharmacy/Pharmacy";
import { PharmacyResultCard } from "../../../components/PharmacySearch/PharmacyResultCard/PharmacyResultCard";
import { SelectedPharmacyCard } from "../../../components/PharmacySearch/SelectedPharmacyCard/SelectedPharmacyCard";
import { MedicationSearchInput } from "../../../components/SearchInput/SearchInput";


let _pharmacies: Pharmacy[] = [
  {id: 1, name: 'CVS Boylston', phone: '203-454-4564', location: {lat: 42.7284, lng: -73.587576}, selected: false, address: '10 hillside rd, westport ct, 06880'}, 
  {id: 2, name: 'Wallgreens Brookline', phone: '203-454-4564', location: {lat: 42.8284, lng: -73.587576}, selected: false, address: '10 hillside rd, westport ct, 06880'}, 
  {id: 3, name: 'CVS Norwalk', phone: '203-454-4564', location: {lat: 42.5284, lng: -73.787576}, selected: false, address: '10 hillside rd, westport ct, 06880'}, 
  {id: 4, name: 'Duane Reade', phone: '203-454-4564', location: {lat: 42.5284, lng: -73.687576}, selected: false, address: '10 hillside rd, westport ct, 06880'}, 
  {id: 5, name: 'CVS Allston', phone: '203-454-4564', location: {lat: 42.8284, lng: -73.787576}, selected: false, address: '10 hillside rd, westport ct, 06880'}, 
  {id: 6, name: 'Wallgreens South End', phone: '203-454-4564', location: {lat: 42.8584, lng: -73.683576}, selected: false, address: '10 hillside rd, westport ct, 06880'}
];

export default function Map() {
  const [locationError, setLocationError] = useState<string|undefined>(undefined); // stores user location error
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(_pharmacies); // store list of pharmacies in search
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy|undefined>();
  const [map, setMap] = useState<google.maps.Map>(); // map ref

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
      focusMapOnPharmacy({map, pharmacy}) // center and zoom map on selected pharmacy
    } else { // diselect all pharmacies
      updatedList = pharmacies.map(_pharmacy => ({
        ..._pharmacy, // Spread the existing properties
        selected: false, 
      }));
      setSelectedPharmacy(undefined); // set selected pharmacy to undefined
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

      {/* header */}
      <div style={{display: 'flex', minWidth: '100vw', justifyContent: 'space-between', alignItems: 'center', height: 65, paddingLeft: 10, paddingRight: 15, }}>
        {/* title */}
        <h1 style={{color: 'black'}}>Rx-Radar</h1>

        {/* search */}
        <div style={{gap: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', paddingRight: 40, paddingLeft: 40, padding: 10}}>

          {/* medication text input */}
          <MedicationSearchInput />

          {/* location text input box */}
          <a data-tooltip-id="my-tooltip" style={{zIndex: 100000}} data-tooltip-content="Check back soon, we're adding new locations.">
            <div style={{display: 'inline-flex', minWidth: 200, paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, borderRadius: 5, backgroundColor: '#F5F5F5', alignItems: 'center', outline: 'none' }}>

              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <p style={{fontSize: 16, color: 'black', marginLeft: 5}}>Troy, NY</p>
              <Tooltip id="my-tooltip" />
            </div>
          </a>

          <button className={styles.newButton}>Search</button>
        </div>
      </div>


      {/* main body contents */}
      <div style={{display: 'flex', width: '100vw', overflowY: 'clip', height: '91vh', justifyContent: 'center',}}>
        <div style={{height: '100vh', width: '32vw', flexDirection: 'column', placeItems: 'center', display: 'flex', padding: 10, paddingTop: 0}}>

          {/* search results title */}
          <div style={{display: 'flex', width: '100%' }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <h3 style={{color: 'black', marginLeft: 5}}> results for</h3>  
              <div style={{backgroundColor: '#F5F5F5', padding: 8, marginLeft: 5, color: '#AA98A9', fontWeight: '700', borderRadius: 7}}>300mg</div>
              <h3 style={{color: 'black', marginLeft: 5}}>of</h3>  
              <div style={{backgroundColor: '#F5F5F5', padding: 8, marginLeft: 5, color: '#AA98A9', fontWeight: '700', borderRadius: 7}}>Adderall</div>
              <h3 style={{marginLeft: 5, color: 'black',}}>within</h3>
              <div style={{backgroundColor: '#F5F5F5', padding: 8, marginLeft: 5, color: '#AA98A9', fontWeight: '700', borderRadius: 7}}>5 mi</div>
            </div>
          </div>

          {/* search results scroll view*/}
          { selectedPharmacy ? 
            <SelectedPharmacyCard pharmacy={selectedPharmacy} onSelectPharmacy={onSelectPharmacy}/> :
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, overflowY: 'scroll', scrollbarWidth: 'none', height: '82vh', }}>
              {pharmacies.map((pharmacy) => (
                <PharmacyResultCard key={pharmacy.id} pharmacy={pharmacy} pharmacyCardSelect={onSelectPharmacy}/>
              ))}
            </div>
          }
        </div>

        {/* map componenet */}
        <Map height="89.5vh" width="70vw" pharmacies={pharmacies} selectPharmacy={onSelectPharmacy} error={locationError} map={map} setMap={setMap}/>

      </div>    
    </main>
  );
}

