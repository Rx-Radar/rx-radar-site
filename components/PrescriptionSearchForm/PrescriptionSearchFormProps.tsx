import styles from './PrescriptionSearchFormProps.module.css';
import Link from 'next/link';


// npm inports
import { SearchInput } from '../SearchInput/SearchInput';
import { OptionInput } from '../OptionInput/OptionInput';
import { PhoneInput } from 'react-international-phone';
import { Tooltip } from 'react-tooltip'
import { useState } from 'react';
import { flightRouterStateSchema } from 'next/dist/server/app-render/types';

import { PrescriptionSearch } from '../../types/PrescriptionSearch';


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
  const [location, setLocation] = useState<string>('Troy, NY') // harded coded location for MVP

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

        phoneNumber: '+16505553434', // NUMBER FOR TESTING AUTH VERIFICATION --> corresponds to code 123456
        // phoneNumber: phoneNumber,
        prescription: {
          name: medication,
          dosage: dosage,
          brand: brand,
          quantity: quantity,
          type: type
        },
        location: location // MVP hard coded to Troy, NY 
      }
      initializeMedicationSearch(prescriptionSearch)
    }

    return (
        <button 
        className={styles.buttonStyle} 
        onClick={onClick}
        disabled={loading}
        >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5295 8.35186C12.9571 8.75995 12.2566 9 11.5 9C9.567 9 8 7.433 8 5.5C8 3.567 9.567 2 11.5 2C12.753 2 13.8522 2.65842 14.4705 3.64814M6 20.0872H8.61029C8.95063 20.0872 9.28888 20.1277 9.61881 20.2086L12.3769 20.8789C12.9753 21.0247 13.5988 21.0388 14.2035 20.9214L17.253 20.3281C18.0585 20.1712 18.7996 19.7854 19.3803 19.2205L21.5379 17.1217C22.154 16.5234 22.154 15.5524 21.5379 14.9531C20.9832 14.4134 20.1047 14.3527 19.4771 14.8103L16.9626 16.6449C16.6025 16.9081 16.1643 17.0498 15.7137 17.0498H13.2855L14.8311 17.0498C15.7022 17.0498 16.4079 16.3633 16.4079 15.5159V15.2091C16.4079 14.5055 15.9156 13.892 15.2141 13.7219L12.8286 13.1417C12.4404 13.0476 12.0428 13 11.6431 13C10.6783 13 8.93189 13.7988 8.93189 13.7988L6 15.0249M20 6.5C20 8.433 18.433 10 16.5 10C14.567 10 13 8.433 13 6.5C13 4.567 14.567 3 16.5 3C18.433 3 20 4.567 20 6.5ZM2 14.6L2 20.4C2 20.9601 2 21.2401 2.10899 21.454C2.20487 21.6422 2.35785 21.7951 2.54601 21.891C2.75992 22 3.03995 22 3.6 22H4.4C4.96005 22 5.24008 22 5.45399 21.891C5.64215 21.7951 5.79513 21.6422 5.89101 21.454C6 21.2401 6 20.9601 6 20.4V14.6C6 14.0399 6 13.7599 5.89101 13.546C5.79513 13.3578 5.64215 13.2049 5.45399 13.109C5.24008 13 4.96005 13 4.4 13L3.6 13C3.03995 13 2.75992 13 2.54601 13.109C2.35785 13.2049 2.20487 13.3578 2.10899 13.546C2 13.7599 2 14.0399 2 14.6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <p style={{color: 'white', fontWeight: '600'}}>Find medication</p>
        </button>
    );
  }

  return (
      <div className={styles.prescription_search_form}>

          <p style={{fontSize: 20, marginBottom: 10, marginTop: 10, color: '#F94D00', fontWeight: '600'}}>Begin a new search</p>

          {/* medication search input */}
          <SearchInput placeholder='Medication Name' searchList={medications} onChange={(value) => setMedication(value)}/>

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
            <a data-tooltip-id="my-tooltip" data-tooltip-place="left" style={{zIndex: 1000}} data-tooltip-content="Check back soon, we're adding new locations.">
              <div className={styles.searchInput}>
                <p style={{fontSize: 12, color: '#F94D00'}}>Your Location</p>
                <input disabled={true} value={'Troy, NY'} style={{width: '100%', fontSize: 16, backgroundColor: '#FFB788', border: 'none', color: 'white'}} autoComplete='phone-number' placeholder="Your address"/> 
              </div>
            </a>
          </div>
          <Tooltip id="my-tooltip" />

          {/* search send button */}
          <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <SearchForMedicationButton/>  
          </div>

          <div style={{width: '100%', marginTop: 10, textAlign: 'center'}}>
            <p className={styles.disclaimer}>By pressing "Find medication" you agree to our <Link style={{fontWeight: '700'}} href="/privacy-policy">Privacy Policy</Link> and consent to receiving SMS notifications from RxRadar</p>
          </div>
            
        </div>
  );
}