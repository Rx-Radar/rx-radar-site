// index page
'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';

// npm inports
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Tooltip } from 'react-tooltip'
import ReactInputVerificationCode from 'react-input-verification-code';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// local inports
import QuantumLoader from '../../components/LoaderAnimations/QuantumLoader/QuantumLoader';
import RxRadarLogoBeacon from './images/RxRadarLogoBeacon';
import { OptionInput } from '../../components/OptionInput/OptionInput';
import { setupRecaptcha, sendSMSVerification, signUserIn} from './verifier';
import { SearchInput } from '../../components/SearchInput/SearchInput';


const medications = ['Ritalin', 'Adderall', 'Dexedrine', 'Daytrana', 'Vyvanse'];


export default function Index() {
  const navigation = useRouter(); // navigation router

  // true when the application is loading
  const [loading, setLoading] = useState<boolean>(false); 

  // user search process state
  type SearchState = 'START' | 'VERIFICATION_SENT' | 'SEARCH_STARTED';
  const [searchState, setSearchState] = useState<SearchState>('START');

  // on page load setup
  useEffect(() => {
    setupRecaptcha();
  }, []);


  // triggers medication search
  const initializeMedicationSearch = () => {
    const { number } = validateForm(); // unpack validate form data

    setLoading(true);
    sendSMSVerification(number)
        .then((successMessage) => {
          setSearchState('VERIFICATION_SENT');
          setLoading(false);
        })
        .catch((error) => console.error('Error sending SMS verification:', error));
  }

  // verifies user entered code
  const verifyCodeEntered = (code: string) => {
    signUserIn(code)
        .then(async (userSessionToken) => {
          //await makeInitSearchPost(userSessionToken) ######## uncomment this to call api ########
          setSearchState('SEARCH_STARTED');
        })
        .catch((error) => console.log(error));
  }

  async function makeInitSearchPost(userSessionToken: string) {
    const url = 'https://northamerica-northeast1-rxradar.cloudfunctions.net/init-search';
  
    const body = {
      user_session_token: userSessionToken,
      phone_number: '12032248444',
      user_location: 'Troy, NY',
      medication: {
        name: 'Focalin',
        dosage: '10',
        brand_or_generic: 'generic',
        quantity: '60',
        type: 'IR'
      }
    };
  
    try {
      const response = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response:', response.data);
      console.log("Status:", response.status)
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      // handle errors
    }
  }

  // validate medication search form data
  const validateForm = (): {number: string; medication: string; dosage: string, brand: string} => {
    // #########################################################
    // RETURN TEST DATA
    return {number: '+16505553434', medication: 'adderall', dosage: '10mg', brand: 'generic'}
    // #########################################################
  }

  // Button; triggers medication search
  const SearchForMedicationButton = () => {
    return (
        <button 
        className={styles.buttonStyle} 
        onClick={initializeMedicationSearch}
        disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.0497 6C15.0264 6.19057 15.924 6.66826 16.6277 7.37194C17.3314 8.07561 17.8091 8.97326 17.9997 9.95M14.0497 2C16.0789 2.22544 17.9713 3.13417 19.4159 4.57701C20.8606 6.01984 21.7717 7.91101 21.9997 9.94M10.2266 13.8631C9.02506 12.6615 8.07627 11.3028 7.38028 9.85323C7.32041 9.72854 7.29048 9.66619 7.26748 9.5873C7.18576 9.30695 7.24446 8.96269 7.41447 8.72526C7.46231 8.65845 7.51947 8.60129 7.63378 8.48698C7.98338 8.13737 8.15819 7.96257 8.27247 7.78679C8.70347 7.1239 8.70347 6.26932 8.27247 5.60643C8.15819 5.43065 7.98338 5.25585 7.63378 4.90624L7.43891 4.71137C6.90747 4.17993 6.64174 3.91421 6.35636 3.76987C5.7888 3.4828 5.11854 3.4828 4.55098 3.76987C4.2656 3.91421 3.99987 4.17993 3.46843 4.71137L3.3108 4.86901C2.78117 5.39863 2.51636 5.66344 2.31411 6.02348C2.08969 6.42298 1.92833 7.04347 1.9297 7.5017C1.93092 7.91464 2.01103 8.19687 2.17124 8.76131C3.03221 11.7947 4.65668 14.6571 7.04466 17.045C9.43264 19.433 12.295 21.0575 15.3284 21.9185C15.8928 22.0787 16.1751 22.1588 16.588 22.16C17.0462 22.1614 17.6667 22 18.0662 21.7756C18.4263 21.5733 18.6911 21.3085 19.2207 20.7789L19.3783 20.6213C19.9098 20.0898 20.1755 19.8241 20.3198 19.5387C20.6069 18.9712 20.6069 18.3009 20.3198 17.7333C20.1755 17.448 19.9098 17.1822 19.3783 16.6508L19.1835 16.4559C18.8339 16.1063 18.6591 15.9315 18.4833 15.8172C17.8204 15.3862 16.9658 15.3862 16.3029 15.8172C16.1271 15.9315 15.9523 16.1063 15.6027 16.4559C15.4884 16.5702 15.4313 16.6274 15.3644 16.6752C15.127 16.8453 14.7828 16.904 14.5024 16.8222C14.4235 16.7992 14.3612 16.7693 14.2365 16.7094C12.7869 16.0134 11.4282 15.0646 10.2266 13.8631Z" stroke="#FBCEB1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{color: '#FBCEB1'}}>Get results now</p>
        </button>
    );
  }

  // main hero content with medication search form
  const HeroContent = () => {

    // user form fields
    const [medication, setMedication] = useState<string>('');
    const [dosage, setDosage] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [location, setLocation] = useState<string>('')

    return <div>
      <div style={{width: '100%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <RxRadarLogoBeacon />
        </div>

        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          
          {/* main row contents */}
          <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 200}}>

            {/* left box (content) */}
            <div style={{padding: 10, height: 'fit-content', width: '40vw', minWidth: 400,}}>
              <p style={{fontSize: 42, fontWeight: '600', color: '#FFB788',}}>Your 💊 out of stock?</p>
              <p style={{fontSize: 42, fontWeight: '700'}}>In 10 min we'll find and text you where it's available.</p>
              <p style={{fontSize: 42, fontWeight: '600', color: '#FFB788',}}> You're welcome.</p>
            </div>

            {/* right box (input form)*/}
            <div style={{padding: 20, minWidth: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', backgroundColor: '#FBCEB1', height: 'fit-content', width: '30vw', borderRadius: 12, border: '2px solid #F94D00'}}>

              {/* medication search input */}
              <SearchInput placeholder='Medication Name' searchList={medications} onChange={(val) => console.log(val)}/>

              {/* medication parameters */}
              <div style={{display: 'flex', width: '100%', gap: 8, marginTop: 16}}>
                <OptionInput style={{width: '50%'}} name='Dosage' options={['10mg', '20mg', '30mg', '40mg', '80mg', '100mg', '120mg']}/>
                <OptionInput style={{width: '50%'}} name='Type' options={['Brand Name', 'Generic', 'Either']}/>
                <OptionInput style={{width: '50%'}} name='Quantity' options={['30', '60', '80', '100']}/>
              </div>



              {/* phone input */}
              <div style={{width: '100%'}}>
                <PhoneInput
                placeholder='Phone Number'
                disableDialCodePrefill={true}            
                hideDropdown={true}
                inputClassName={styles.phoneInput}
                inputStyle={{width: '100%', border: 'none', backgroundColor: '#FFB788', marginTop: 16, borderRadius: 5, height: 50, paddingLeft: 12, color: 'white', fontSize: 16, caretColor: 'black'}}
                countrySelectorStyleProps={{buttonStyle: {border: 'none', marginTop: 16, display: 'none'}}}
                defaultCountry="us"
                disableDialCodeAndPrefix={true}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                />
              </div>

                {/* location search (hard coded to Troy, NY) */}
                <div style={{width: '100%'}}>
                  <a data-tooltip-id="my-tooltip" data-tooltip-place="left" style={{zIndex: 100000}} data-tooltip-content="Check back soon, we're adding new locations.">
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

              <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 10, flexDirection: 'column'}}>
                <p style={{color: '#F94D00', fontSize: 10, paddingTop: 4}}>By pressing "get results now" you consent to receiving SMS notifications by RxRadar</p>
              </div>
              
            </div>

          </div>

        </div>
    </div>
  }

  // verification code entry page
  const VerificationContent = () => {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          {/* {(loading && !verificationCodeSent) ? <Loader /> : <Confirmation />} */}
          <RxRadarLogoBeacon />
          <p style={{fontSize: 32, fontWeight: '700', marginBottom: 100}}>Enter verification code to complete medication search</p>
          <ReactInputVerificationCode length={6} autoFocus={true} placeholder='' onCompleted={(code) => verifyCodeEntered(code)}/>
      </div>
    );
  }

  const SearchSentContent = () => {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <p style={{fontSize: 40, fontWeight: '700', color: 'black'}}>Congrats, you're one step closer to getting your meds</p>
        <p style={{fontSize: 40, fontWeight: '700', color: '#F94D00'}}>RxRadar should text you in ~10 min</p>
      </div>
    );
  }
  

  // loading screen
  const Loader = () => {
      return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <QuantumLoader/>
          <p style={{marginTop: 28}}>Sending Phone Verification</p>
      </div>
  }

  // return main page contents
  return <div style={{position: 'relative', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', padding: 10, backgroundColor: 'white', color: 'black'}}>    

    { searchState == 'START' && <HeroContent/> }
    { searchState == 'VERIFICATION_SENT' && <VerificationContent/> }
    { searchState == 'SEARCH_STARTED' && <SearchSentContent/> }

    <div id='recaptcha'></div>
    <ToastContainer />
  </div>

}
