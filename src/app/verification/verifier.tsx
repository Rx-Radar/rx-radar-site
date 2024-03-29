import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase-config";
import { signInWithPhoneNumber } from "firebase/auth";
import { useRouter } from 'next/navigation';


interface CustomWindow extends Window {
    confirmationResult?: ConfirmationResult | null;
    recaptchaVerifier: RecaptchaVerifier;
  }
  
  declare const window: CustomWindow;
  

// step 1. setup recaptcha to verify user and prevent abuse (triggered on user submitting medication search form)
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

// step 2. sends user sms verification
export const onSearchForMedication = (phoneNumber: string) => {
    // const navigation = useRouter(); // navigation router

    const appVerifier = window.recaptchaVerifier; // captcha verification
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;

            // store the users phone confirmation state sent
            sessionStorage.setItem('status', 'VERIFICATION_CODE_SENT');

            console.log('in method to send user verification');
            // navigation.push('/verification');
        }).catch((error) => {
            // Error; SMS not sent
            console.error('Error during signInWithPhoneNumber', error);
        }
    );
};

// step 3. sign user in --> user attempt to verify code
export const attemptUserSignIn = (code: string) => {
    if (code && window.confirmationResult) {
        window.confirmationResult.confirm(code)
            .then((result) => {
                // User signed in successfully.
                console.log('User signed in successfully.');
            //   setUserSignedIn(true); 
            }).catch((error) => {
                // User couldn't sign in (bad verification code?)
                console.error('Error during confirmationResult.confirm', error);

            }
        );
    }
};