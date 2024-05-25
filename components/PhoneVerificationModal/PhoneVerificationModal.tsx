// components/PhoneVerificationModal.tsx
import React from 'react';
import ReactInputVerificationCode from 'react-input-verification-code';
import styles from './PhoneVerificationModal.module.css';

import { signUserIn } from '../../utils/AuthVerifier';

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  sendSearchRequest: (userSessionToken: string) => void;
}

const PhoneVerificationModal: React.FC<ModalProps> = ({ showModal, setShowModal, sendSearchRequest }) => {
  if (!showModal) return null;

  // verifies sms auth on user enter code completion
  const verifyCodeEntered = (code: string) => {
    signUserIn(code)
      .then((userSessionToken) => {
        sendSearchRequest(userSessionToken);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded flex flex-col p-8">

            <p className="text-2xl mb-16 font-medium text-center">Enter SMS verification code</p>

            <ReactInputVerificationCode
            length={6}
            autoFocus={true}
            placeholder=""
            onCompleted={(code) => verifyCodeEntered(code)}
            />
                
            {/* <button
            className="px-4 py-2 mt-8 bg-blue-500 text-white rounded"
            onClick={() => setShowModal(false)}
            >
            DEV DISMISS
            </button> */}
        </div>
    </div>
  );
};

export default PhoneVerificationModal;
