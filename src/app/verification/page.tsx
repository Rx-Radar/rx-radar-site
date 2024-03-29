'use client';

import { app, auth } from '../firebase-config';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './PhoneVerificationModal.module.css';
import QuantumLoader from '../../../components/LoaderAnimations/QuantumLoader/QuantumLoader';

import ReactInputVerificationCode from 'react-input-verification-code';

import { useRouter } from 'next/navigation';

import { signInWithPhoneNumber, } from "firebase/auth";
import { medicationSearchStatus } from '../page';

// // defines recaptcha verifier definition
// declare global {
//     interface Window {
//         recaptchaVerifier: RecaptchaVerifier;
//         confirmationResult: ConfirmationResult;
//     }
// }



// phone verification modal
export default function Verification() {
    const navigation = useRouter(); // navigation router


    useEffect(() => {
        const status = sessionStorage.getItem('status');

        // direct user back to home if a verification code hasnt been set
        if (status != "VERIFICATION_CODE_SENT") {
            navigation.push('/');
            console.log('this is here');
        }

    },[]);

    /*
    ############################################################################
    FIREBASE AUTH USER SMS PHONE VERIFICATION
    ############################################################################
    */


    /*
    ############################################################################
    */

    // loading screen
    // const Loader = () => {
    //     return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
    //         <QuantumLoader/>
    //         <p style={{marginTop: 28}}>Sending Phone Verification</p>
    //     </div>
    // }

    // // confirmation / verification modal
    // const Confirmation = () => {
    //     return <div style={{padding: 30, backgroundColor: 'white', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>    
    //         <p style={{color: 'black', fontWeight: '600', fontSize: 24}}>Phone Verification</p>
    //         {/* <ReactInputVerificationCode length={6} placeholder='' onCompleted={(value) => console.log(value.length == 6)}/> */}
    //         <button onClick={() => attemptUserSignIn()} style={{fontSize: 24, marginTop: 16, border: 'none', padding: 8, borderRadius: 4}}>Verify</button>
    //         <p style={{color: 'black', fontSize: 12, marginTop: 14}}>by selecting "verify and search" you agree to Rx-Radars terms of use</p>
    //     </div>
    // }

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: 'white', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            {/* {(loading && !verificationCodeSent) ? <Loader /> : <Confirmation />} */}
            <p style={{fontSize: 32, fontWeight: '700', marginBottom: 100}}>Enter verification code</p>
            <ReactInputVerificationCode length={6} placeholder='' onCompleted={(value) => console.log(value.length == 6)}/>
        </div>
    );
}