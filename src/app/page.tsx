// index page
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

import axios from 'axios';

// npm inports
import 'react-international-phone/style.css';
import ReactInputVerificationCode from 'react-input-verification-code';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// local inports
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import QuantumLoader from '../../components/LoaderAnimations/QuantumLoader/QuantumLoader';
import RxRadarLogoBeacon from './images/RxRadarLogoBeacon';
import { setupRecaptcha, sendSMSVerification, signUserIn} from './verifier';
import { PrescriptionSearchForm } from '../../components/PrescriptionSearchForm/PrescriptionSearchFormProps';

import { ReactSVG } from 'react-svg'



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
          // await makeInitSearchPost(userSessionToken) //######## uncomment this to call api ########
          setSearchState('SEARCH_STARTED');
        })
        .catch((error) => console.log(error));
  }

  async function makeInitSearchPost(userSessionToken: string) {
    const url = 'https://northamerica-northeast1-rxradar.cloudfunctions.net/init-search-bland'; // calls init-search-bland MVP
  
    const body = {
      user_session_token: userSessionToken,
      phone_number: '+12037674296',
      user_location: 'Troy, NY',
      medication: {
        name: 'Focalin',
        dosage: '10',
        brand_or_generic: 'generic',
        quantity: '90',
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

    return (
      <div style={{width: '100vw', height: '100vh', display: 'flex', overflowY: 'auto', flexDirection: 'column'}}>
        
        {/* main row contents */}
        <div className={styles.hero_content}>

          {/* left box (content) */}
          <div className={styles.hero_text_container}>
            <p style={{color: '#FB4E00'}}>Meds in shortage?</p>
            <p>We find a nearby pharmacy that has them</p>
            <p style={{color: '#FB4E00'}}>Then we'll text you in ~10</p>
          </div>

          {/* right box (input form)*/}
          <PrescriptionSearchForm loading={false} initializeMedicationSearch={initializeMedicationSearch}/>

        </div>


        {/* <p style={{width: 200}}>
          MORE CONTENT HERE
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg
        asdfgsdfgsdfgsdfgsdfg

        </p> */}

      </div>
    );
  }

  // verification code entry page
  const VerificationContent = () => {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
          
          <p className={styles.enter_verification_code_text}>Enter SMS verification code to continue</p>
          
          <div className={styles.input_verification}>
            <ReactInputVerificationCode length={6} autoFocus={true} placeholder='' onCompleted={(code) => verifyCodeEntered(code)}/>
          </div>
      </div>
    );
  }

  const SearchSentContent = () => {
    return (
      <div style={{ width: '100vw', height: '100vh', backgroundColor: '#FBCEB1', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <div className={styles.hero_text_container}>
          <p style={{color: 'black'}}>Searching for meds!</p>
          <p style={{color: '#F94D00'}}>We'll text you soon</p>
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
      {/* <ReactSVG src='/HeroPageBackground.svg' style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'none'}} /> */}

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


