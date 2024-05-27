import styles from './PrescriptionSearchForm.module.css';
import Link from 'next/link';

// npm inports
import { SearchInput } from '../SearchInput/SearchInput';
import { OptionInput } from '../OptionInput/OptionInput';
import { PhoneInput } from 'react-international-phone';
import { useState } from 'react';
import { toast, Bounce } from "react-toastify";

import { PrescriptionSearch } from '../../types/PrescriptionSearch';
import { SearchLocation } from '../../types/SearchLocation';

import AutoComplete from "react-google-autocomplete";

// search input props
interface PrescriptionSearchFormProps {
    loading: boolean; 
    style?: React.CSSProperties;
    initializeMedicationSearch: (prescriptionSearch: PrescriptionSearch) => void; // function called on option input changed
}

export const PrescriptionSearchForm:React.FC<PrescriptionSearchFormProps> = ({loading, initializeMedicationSearch}) => {
  // user form fields
  const [medication, setMedication] = useState<string>('');
  const [dosage, setDosage] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [userLocation, setUserLocation] = useState<SearchLocation | undefined>(undefined);

  // form options
  const medications = ['Ritalin', 'Adderall', 'Focalin', 'Dexedrine', 'Daytrana', 'Vyvanse'];
  const dosages = ['5mg', '10mg', '15mg', '20mg', '25mg', '30mg', '35mg', '40mg', '45mg', '50mg', '55mg', '60mg', '65mg', '70mg', '75mg', '80mg', '85mg'];
  const brands = ['Brand', 'Generic', 'Either'];
  const quantities = ['30', '60', '80', '100'];
  const types = ['IR', 'XR', 'N/A'];

  // Button; triggers medication search
  const SearchForMedicationButton = () => {

    // on search button click
    const onClick = () => {
      const prescriptionSearch: PrescriptionSearch = {
        // phoneNumber: '+16505553434', // NUMBER FOR TESTING AUTH VERIFICATION --> corresponds to code 123456
        phoneNumber: phoneNumber,
        prescription: {
          name: medication,
          dosage: dosage,
          brand: brand,
          quantity: quantity,
          type: type
        },
        location: userLocation
      }
      initializeMedicationSearch(prescriptionSearch)
    }

    return (
      <button 
      className="flex items-center justify-center px-6 py-3 text-white transition-all duration-300 bg-orange-500 rounded-lg hover:bg-orange-600 hover:shadow-md focus:outline-none"
      onClick={onClick}
      disabled={loading}
      >
        <p style={{color: 'white', fontWeight: '600'}}>Start Search</p>
      </button>
    );
  }

  // set user postion lat lon
  function setUserPos(placeResult: google.maps.places.PlaceResult) {
    const location = placeResult.geometry?.location;

    if (location) {
      // update user location
      setUserLocation({lat: location.lat(), lon: location.lng()}) 
    } else {
      
      toast.error("Try a different address", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  return (
      <div className={styles.prescription_search_form}>

          <p style={{fontSize: 20, marginBottom: 10, marginTop: 10, color: '#F94D00', fontWeight: '600'}}>Begin a new search</p>

          {/* medication search input */}
          <SearchInput placeholder='Medication Name' searchList={medications} onChange={(value) => setMedication(value)} bottomSearchLink={new URL("https://forms.gle/YUuvJeVDiNb7Qdhr9")} bottomSearchText='Looking for a different medication?'/>

          {/* medication parameters */}
          <div className={styles.medication_options}>
            <div className={styles.option_input_pair}>
              <OptionInput style={{width: '100%'}} onChange={(option) => setDosage(option)} name='Dosage' options={dosages}/>
              <OptionInput style={{width: '100%'}} onChange={(option) => setBrand(option)} name='Brand/Generic' options={brands}/>
            </div>
            <div className={styles.option_input_pair}>
              <OptionInput style={{width: '100%'}} onChange={(option) => setQuantity(option)} name='Quantity' options={quantities}/>
              <OptionInput style={{width: '100%'}} onChange={(option) => setType(option)} name='Type' options={types}/>
            </div>
          </div>

          {/* phone input */}
          <div style={{width: '100%'}}>
            <PhoneInput
            placeholder='Phone Number'
            disableDialCodePrefill={true}            
            hideDropdown={true}
            inputClassName={styles.phoneInput}
            inputStyle={{width: '100%', border: 'none', backgroundColor: '#FFB788', borderRadius: 5, height: 50, paddingLeft: 12, color: 'white', fontSize: 16, caretColor: 'black'}}
            countrySelectorStyleProps={{buttonStyle: {border: 'none', marginTop: 16, display: 'none'}}}
            defaultCountry="us"
            disableDialCodeAndPrefix={true}
            value={phoneNumber}
            onChange={(phone) => setPhoneNumber(phone)}
            />
          </div>

          {/* location search (hard coded to Troy, NY) */}
          <div style={{width: '100%'}}>
              <AutoComplete
              placeholder="Your Address"
              apiKey={'AIzaSyDxwmfjF7IGF4z5vxUH1quzK7W9lYjJTzE'}
              onPlaceSelected={setUserPos}
              options={{
                types: ['address'],
                componentRestrictions: { country: 'us' }, // Restrict to United States
              }}
              style={{width: '100%', height: 50}}
              className={styles.searchInput}
              />
          </div>


          {/* search send button */}
          <div className="w-full p-3 bg-white rounded-xl flex flex-col md:flex-row md:space-x-2 space-x-0 space-y-2 md:space-y-0 justify-between md:items-center">

            <div className="flex flex-col">
              <p className="font-bold text-xl">One Time Search</p>
              <p className="font-medium text-xl">$5</p>
            </div>

            <SearchForMedicationButton/>  

          </div>

          <div style={{width: '100%', textAlign: 'center'}}>
            <p className={styles.disclaimer}>By pressing "Find medication" you agree to our <Link style={{fontWeight: '700'}} href="/privacy">Privacy Policy</Link> and consent to receiving SMS notifications from RxRadar</p>
          </div>
            
        </div>
  );
}