// index page

'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useState } from 'react';

import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Tooltip } from 'react-tooltip'

import { SearchInput } from '../../components/SearchInput/SearchInput';
import PhoneVerifificationModal from '../../components/PhoneVerificationModal/PhoneVerificationModal';

import RxRadarLogoBeacon from './images/RxRadarLogoBeacon';
import { OptionInput } from '../../components/OptionInput/OptionInput';

const medications = ['Ritalin', 'Adderall', 'Dexedrine', 'Daytrana', 'Vyvanse'];


export default function Index() {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

  return <div style={{position: 'relative', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', padding: 10, backgroundColor: 'white', color: 'black'}}>
    
    {/* <div style={{width: '100%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <RxRadarLogoBeacon />
    </div> */}

    <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      
      {/* main row contents */}
      <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 200}}>

        {/* left box (content) */}
        {/* <div style={{padding: 10, height: 'fit-content', width: '40vw', minWidth: 400,}}>
          <p style={{fontSize: 42, fontWeight: '700'}}>Give us 10 ⏲️ and we'll find what pharmacies have your 💊 in stock.</p>
          <p style={{fontSize: 42, fontWeight: '500', marginTop: 12, color: '#FFB788',}}> You're welcome.</p>
        </div> */}

        {/* right box (input form)*/}
        <div style={{padding: 20, minWidth: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', backgroundColor: '#FBCEB1', height: 'fit-content', width: '30vw', borderRadius: 12, border: '2px solid #F94D00'}}>

          {/* medication search input */}
          <SearchInput placeholder='Medication Name' searchList={medications}/>

          {/* medication parameters */}
          <div style={{display: 'flex', width: '100%', gap: 8, marginTop: 16}}>
            <OptionInput style={{width: '50%'}} name='Dosage' options={['10mg', '20mg', '30mg', '40mg', '80mg', '100mg', '120mg']}/>
            <OptionInput style={{width: '50%'}} name='Brand' options={['Brand Name', 'Generic', 'Either']}/>
            <OptionInput style={{width: '50%'}} name='Quantity' options={['30', '60', '80', '100']}/>
          </div>

          {/* phone input */}
          <div style={{width: '100%'}}>
            <PhoneInput
            placeholder='Phone Number'
            disableDialCodePrefill={true}            
            hideDropdown={true}
            inputClassName={styles.phoneInput}
            inputStyle={{width: '100%', border: 'none', backgroundColor: '#FFB788', marginTop: 16, borderRadius: 5, height: 50, paddingLeft: 12, color: 'white', fontSize: 16, caretColor: 'black',}}
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
                  <p style={{fontSize: 12, color: '#F94D00'}}>Your location</p>
                  <input disabled={true} value={'Troy, NY'} style={{width: '100%', fontSize: 16, backgroundColor: '#FFB788', border: 'none', color: 'white'}} autoComplete='phone-number' placeholder="Your address"/> 
                </div>
              </a>
            </div>
            <Tooltip id="my-tooltip" />

          {/* send button / phone verification modal */}
          <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <PhoneVerifificationModal/>  
          </div>

          <p style={{color: '#F94D00', fontSize: 10, paddingTop: 4}}>*RxRadar varies in accuracy, and may not always return updated information</p>
        </div>

      </div>

      {/* search the map */}
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: 50}}>
        <Link href="/map" style={{display: 'flex', alignItems: 'center'}}>
          <p style={{fontSize: 20}}>or, search the map</p>
          <svg style={{marginLeft: 4}} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

    </div>

  </div>
}