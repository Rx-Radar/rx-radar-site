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
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import QuantumLoader from '../../components/LoaderAnimations/QuantumLoader/QuantumLoader';
import RxRadarLogoBeacon from './images/RxRadarLogoBeacon';
import { OptionInput } from '../../components/OptionInput/OptionInput';
import { setupRecaptcha, sendSMSVerification, signUserIn} from './verifier';
import { SearchInput } from '../../components/SearchInput/SearchInput';

import { ReactSVG } from 'react-svg'


const medications = ['Ritalin', 'Adderall', 'Focalin', 'Dexedrine', 'Daytrana', 'Vyvanse'];


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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5295 8.35186C12.9571 8.75995 12.2566 9 11.5 9C9.567 9 8 7.433 8 5.5C8 3.567 9.567 2 11.5 2C12.753 2 13.8522 2.65842 14.4705 3.64814M6 20.0872H8.61029C8.95063 20.0872 9.28888 20.1277 9.61881 20.2086L12.3769 20.8789C12.9753 21.0247 13.5988 21.0388 14.2035 20.9214L17.253 20.3281C18.0585 20.1712 18.7996 19.7854 19.3803 19.2205L21.5379 17.1217C22.154 16.5234 22.154 15.5524 21.5379 14.9531C20.9832 14.4134 20.1047 14.3527 19.4771 14.8103L16.9626 16.6449C16.6025 16.9081 16.1643 17.0498 15.7137 17.0498H13.2855L14.8311 17.0498C15.7022 17.0498 16.4079 16.3633 16.4079 15.5159V15.2091C16.4079 14.5055 15.9156 13.892 15.2141 13.7219L12.8286 13.1417C12.4404 13.0476 12.0428 13 11.6431 13C10.6783 13 8.93189 13.7988 8.93189 13.7988L6 15.0249M20 6.5C20 8.433 18.433 10 16.5 10C14.567 10 13 8.433 13 6.5C13 4.567 14.567 3 16.5 3C18.433 3 20 4.567 20 6.5ZM2 14.6L2 20.4C2 20.9601 2 21.2401 2.10899 21.454C2.20487 21.6422 2.35785 21.7951 2.54601 21.891C2.75992 22 3.03995 22 3.6 22H4.4C4.96005 22 5.24008 22 5.45399 21.891C5.64215 21.7951 5.79513 21.6422 5.89101 21.454C6 21.2401 6 20.9601 6 20.4V14.6C6 14.0399 6 13.7599 5.89101 13.546C5.79513 13.3578 5.64215 13.2049 5.45399 13.109C5.24008 13 4.96005 13 4.4 13L3.6 13C3.03995 13 2.75992 13 2.54601 13.109C2.35785 13.2049 2.20487 13.3578 2.10899 13.546C2 13.7599 2 14.0399 2 14.6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <p style={{color: 'white', fontWeight: '600'}}>Find medication</p>
        </button>
    );
  }

  // main hero content with medication search form
  const HeroContent = () => {

    // user form fields
    const [medication, setMedication] = useState<string>('');
    const [dosage, setDosage] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [brand, setBrand] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [location, setLocation] = useState<string>('')

    return <div>
      <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        
        {/* main row contents */}
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 200}}>

          {/* left box (content) */}
          <div style={{padding: 10, height: 'fit-content', width: '43vw', minWidth: 400,}}>
            <p style={{fontSize: 42, fontWeight: '700', color: '#FB4E00',}}>💊 out of stock/in shortage?</p>
            <p style={{fontSize: 42, fontWeight: '700'}}>In 10 min we'll find and text you where it's available.</p>
            <p style={{fontSize: 42, fontWeight: '700', color: '#FB4E00',}}> You're welcome.</p>
          </div>

          {/* right box (input form)*/}
          <div style={{padding: 20, minWidth: 500, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', backgroundColor: '#FBCEB1', height: 'fit-content', width: '30vw', borderRadius: 12, border: '2px solid #F94D00'}}>

            <p style={{fontSize: 20, marginBottom: 15, color: '#F94D00', fontWeight: '600'}}>Begin a new search</p>

            {/* medication search input */}
            <SearchInput placeholder='Medication Name' searchList={medications} onChange={(value) => setMedication(value)}/>

            {/* medication parameters */}
            <div style={{display: 'flex', width: '100%', gap: 8, marginTop: 16}}>
              <OptionInput style={{width: '50%'}} onChange={(option) => setDosage(option)} name='Dosage' options={['10mg', '20mg', '30mg', '40mg', '80mg', '100mg', '120mg']}/>
              <OptionInput style={{width: '50%'}} onChange={(option) => setBrand(option)} name='Brand/Generic' options={['Brand', 'Generic', 'Either']}/>
              <OptionInput style={{width: '50%'}} onChange={(option) => setQuantity(option)} name='Quantity' options={['30', '60', '80', '100']}/>
              <OptionInput style={{width: '50%'}} onChange={(option) => setType(option)} name='Type' options={['IR', 'XR', 'none']}/>
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

            <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 10, alignItems: 'center', flexDirection: 'column'}}>
              <p style={{color: '#F94D00', fontSize: 10, paddingTop: 4}}>By pressing "get results now" you consent to receiving SMS notifications from RxRadar</p>
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
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#FBCEB1', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div>
          <p style={{fontSize: 60, fontWeight: '700', color: 'black'}}>Searching for meds!</p>
          <p style={{fontSize: 40, fontWeight: '700', color: '#F94D00'}}>We'll text you soon</p>
        </div>
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
  return (
    <>
      {/* <img src='https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630' alt="Description" style={{position: 'absolute', width: '100%', height: '100%'}} /> */}
      <ReactSVG src='/HeroPageBackground.svg' style={{position: 'absolute', width: '100%', maxHeight: '100%', backgroundColor: 'green', overflow: 'hidden'}} />

      <div style={{position: 'relative', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', color: 'black'}}>    
        <NavigationBar/>

        { searchState == 'START' && <HeroContent/> }
        { searchState == 'VERIFICATION_SENT' && <VerificationContent/> }
        { searchState == 'SEARCH_STARTED' && <SearchSentContent/> }

        <div id='recaptcha'></div>
        <ToastContainer />
      </div>

    </>
  );
}


