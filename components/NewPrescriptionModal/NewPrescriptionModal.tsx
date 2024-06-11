import React, { useEffect, useState } from "react";

interface NewPrescriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NewPrescriptionModal: React.FC<NewPrescriptionModalProps> = ({ isOpen, setIsOpen }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">

            <div className="p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 bg-white flex flex-col items-start">
                flaskdjhfljhf
            </div>
        </div>
    );
};

export default NewPrescriptionModal;
