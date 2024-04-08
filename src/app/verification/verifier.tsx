import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase-config";
import { signInWithPhoneNumber } from "firebase/auth";

// // navigationUtils.js
// import Router from 'next/router';

import { ToastContainer, toast, Bounce } from 'react-toastify';


interface CustomWindow extends Window {
    confirmationResult?: ConfirmationResult | null;
    recaptchaVerifier: RecaptchaVerifier;
}
  
declare const window: CustomWindow;
  

// Step 1. setup recaptcha to verify user and prevent abuse (triggered on user submitting medication search form)
export const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
        'size': 'invisible',
        'callback': (response:any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log('recaptcha setup')
        },
        'expired-callback': () => {
            console.log('wine')
        }
    });
};

// Step 2. sends SMS verification
export const sendSMSVerification = (phoneNumber: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const appVerifier = window.recaptchaVerifier; // Captcha verification

        toast('Sending Verification Code', { position: "bottom-center", autoClose: 1500, hideProgressBar: true, pauseOnHover: true, progress: undefined, theme: "light", transition: Bounce }); 

        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent
                window.confirmationResult = confirmationResult;
                resolve('SMS verification sent successfully');
            })
            .catch((error) => {
                // Error; SMS not sent
                toast.error('Could not send SMS', { position: "bottom-center", autoClose: 1500, hideProgressBar: true, pauseOnHover: true, progress: undefined, theme: "light", transition: Bounce }); 
                reject(error);
            });
    });
};

// Step 3. sign user in --> user attempt to verify code
export const signUserIn = (code: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (code && window.confirmationResult) {

            // checks if user entered code is correct 
            console.log(code);
            window.confirmationResult.confirm(code)
                .then((result) => {
                    // Confirmation code correct; get user session id token
                    auth.currentUser?.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                        resolve(idToken)
                      }).catch(function(error) {
                        reject('Error during retrieving user token ' + error)
                      })
                }).catch((error) => {
                    // User couldn't sign in (bad verification code?)
                    toast.error('Try again', { position: "bottom-center", autoClose: 1500, hideProgressBar: true, pauseOnHover: true, progress: undefined, theme: "light", transition: Bounce }); 
                    reject('Error during confirmationResult.confirm: ' + error.message);
                });
        } else {
            reject('verification code or confirmation result not provided');
        }
    });
};