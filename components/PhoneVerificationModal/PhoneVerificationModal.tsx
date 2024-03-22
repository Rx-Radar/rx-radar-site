import { app, auth } from '../../src/app/firebase-config';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './PhoneVerificationModal.module.css';
import QuantumLoader from '../LoaderAnimations/QuantumLoader/QuantumLoader';

import { RecaptchaVerifier, ConfirmationResult, signInWithPhoneNumber, } from "firebase/auth";

// // defines recaptcha verifier definition
// declare global {
//     interface Window {
//         recaptchaVerifier: RecaptchaVerifier;
//         confirmationResult: ConfirmationResult;
//     }
// }

// We declare variables used on the window object
// We use a custom interface to avoid these modifying the global Window type in other files
interface CustomWindow extends Window {
    signingIn?: boolean;
    verifyingCode?: boolean;
    confirmationResult?: ConfirmationResult | null;
    recaptchaVerifier: RecaptchaVerifier;
    recaptchaWidgetId?: number;
}

declare const window: CustomWindow;

// phone verification modal
export default function PhoneVerifificationModal() {
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [verificationCodeSent, setVerificationCodeSent] = useState<boolean>(false);
    const [formSubmit, setFormSubmit] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    /*
    ############################################################################
    FIREBASE AUTH USER SMS PHONE VERIFICATION
    ############################################################################
    */

    // on page load setup recaptcha
    useEffect(() => {
        setupRecaptcha();
    }, []);

    // step 1. setup recaptcha to verify user and prevent abuse (triggered on user submitting medication search form)
    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
            'size': 'invisible',
            'callback': (response:any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // setCaptchaComplete(true);
                console.log('recaptcha')
            },
            'expired-callback': () => {
                console.log('wine')
            }
        });
    };

    // step 2. sends user sms verification
    const sendUserPhoneVerification = (phoneNumber: string) => {
        setLoading(true);
        const appVerifier = window.recaptchaVerifier; // captcha verification
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;

                setVerificationCodeSent(true);
                setLoading(false);
            }).catch((error) => {
                // Error; SMS not sent
                console.error('Error during signInWithPhoneNumber', error);
            }
        );
    };

    // step 3. sign user in --> user attempt to verify code
    const attemptUserSignIn = (verificationCode: string|undefined) => {
        if (verificationCode && window.confirmationResult) {
            window.confirmationResult.confirm(verificationCode)
                .then((result) => {
                    // User signed in successfully.
                    console.log('User signed in successfully.');
                }).catch((error) => {
                    // User couldn't sign in (bad verification code?)
                    console.error('Error during confirmationResult.confirm', error);
                }
            );
        }
    };

    /*
    ############################################################################
    */

    // send button (triggers verification) on page
    const SendButton = () => {
        return (
            <button 
            className={styles.buttonStyle} 
            onClick={() => sendUserPhoneVerification('+16505553434')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.0497 6C15.0264 6.19057 15.924 6.66826 16.6277 7.37194C17.3314 8.07561 17.8091 8.97326 17.9997 9.95M14.0497 2C16.0789 2.22544 17.9713 3.13417 19.4159 4.57701C20.8606 6.01984 21.7717 7.91101 21.9997 9.94M10.2266 13.8631C9.02506 12.6615 8.07627 11.3028 7.38028 9.85323C7.32041 9.72854 7.29048 9.66619 7.26748 9.5873C7.18576 9.30695 7.24446 8.96269 7.41447 8.72526C7.46231 8.65845 7.51947 8.60129 7.63378 8.48698C7.98338 8.13737 8.15819 7.96257 8.27247 7.78679C8.70347 7.1239 8.70347 6.26932 8.27247 5.60643C8.15819 5.43065 7.98338 5.25585 7.63378 4.90624L7.43891 4.71137C6.90747 4.17993 6.64174 3.91421 6.35636 3.76987C5.7888 3.4828 5.11854 3.4828 4.55098 3.76987C4.2656 3.91421 3.99987 4.17993 3.46843 4.71137L3.3108 4.86901C2.78117 5.39863 2.51636 5.66344 2.31411 6.02348C2.08969 6.42298 1.92833 7.04347 1.9297 7.5017C1.93092 7.91464 2.01103 8.19687 2.17124 8.76131C3.03221 11.7947 4.65668 14.6571 7.04466 17.045C9.43264 19.433 12.295 21.0575 15.3284 21.9185C15.8928 22.0787 16.1751 22.1588 16.588 22.16C17.0462 22.1614 17.6667 22 18.0662 21.7756C18.4263 21.5733 18.6911 21.3085 19.2207 20.7789L19.3783 20.6213C19.9098 20.0898 20.1755 19.8241 20.3198 19.5387C20.6069 18.9712 20.6069 18.3009 20.3198 17.7333C20.1755 17.448 19.9098 17.1822 19.3783 16.6508L19.1835 16.4559C18.8339 16.1063 18.6591 15.9315 18.4833 15.8172C17.8204 15.3862 16.9658 15.3862 16.3029 15.8172C16.1271 15.9315 15.9523 16.1063 15.6027 16.4559C15.4884 16.5702 15.4313 16.6274 15.3644 16.6752C15.127 16.8453 14.7828 16.904 14.5024 16.8222C14.4235 16.7992 14.3612 16.7693 14.2365 16.7094C12.7869 16.0134 11.4282 15.0646 10.2266 13.8631Z" stroke="#FBCEB1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <p style={{color: '#FBCEB1'}}>Get results now</p>
            </button>
        );
    }

    // loading screen
    const Loader = () => {
        return <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <QuantumLoader/>
            <p style={{marginTop: 28}}>Sending Phone Verification</p>
        </div>
    }

    // confirmation / verification modal
    const Confirmation = () => {
        return <div style={{padding: 30, backgroundColor: 'white', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>    
            <p style={{color: 'black', fontWeight: '600', fontSize: 24}}>Phone Verification</p>
            <input placeholder='Enter Code' value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} autoComplete="one-time-code" style={{padding: '10px 15px', marginTop: 16, backgroundColor: '#F5F5F5', outline: 'none', borderWidth: 0, borderRadius: 4, caretColor: 'black', fontSize: 24, width: 'fit-content'}}/>
            <button onClick={() => attemptUserSignIn(verificationCode)} style={{fontSize: 24, marginTop: 16, border: 'none', padding: 8, borderRadius: 4}}>Hello</button>
            <p style={{color: 'black', fontSize: 12, marginTop: 14}}>by selecting "verify and search" you agree to Rx-Radars terms of use</p>
        </div>
    }

    // modal phone verification
    const VerificationModal = () => {

        return <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', zIndex: 1000}}>
            { (loading && !verificationCodeSent) ? <Loader /> : <Confirmation /> }
        </div>
    }

    return (
        <>
            <SendButton /> 
            <div id='recaptcha'></div>
            {loading && createPortal( <VerificationModal />, document.body)}
        </>
    );
}