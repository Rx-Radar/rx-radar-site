import React, { useEffect, useState } from "react";
import MultiStepProgressBar from './NewSearchProgressBar';

// import new search content
import StepOneContent from './StepOneContent';
import StepTwoContent from "./StepTwoContent";
import StepThreeContent from "./StepThreeContent";

export enum SearchStep {
    One = "Medication",
    Two = "Location",
    Three = "Additional"
}

interface NewSearchModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerNewPrescription: () => void;
}

const NewSearchModal: React.FC<NewSearchModalProps> = ({ isOpen, setIsOpen, triggerNewPrescription }) => {
  const [currentStep, setCurrentStep] = useState<SearchStep>(SearchStep.One);

  useEffect(() => setCurrentStep(SearchStep.One), [isOpen]) // reset to step one

  const nextStep = () => {
    if (currentStep === SearchStep.One) setCurrentStep(SearchStep.Two);
    else if (currentStep === SearchStep.Two) setCurrentStep(SearchStep.Three);
    else setIsOpen(false);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">

        <div className="p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 bg-white flex flex-col items-start">

            {/* new search title */}
            <h1 className="text-2xl font-medium">Create New Search</h1>

            {/* multi step progress bar content */}
            <div className="w-full flex flex-col items-center bg-[#eeeeee] rounded-xl py-1 my-2 shadow-md">
                
                {/* progress bar */}
                <div className="w-4/6 mt-8 mb-6 mx-6">
                    <MultiStepProgressBar step={currentStep} />
                </div>

                {/* step labels */}
                <div className="w-9/12 grid grid-cols-3 gap-44 mb-2">
                    {/* step 1 label */}
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-400">STEP 1</p>
                        <p className="text-sm text-black">Medication</p>
                    </div>
                    {/* step 2 label */}
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-400">STEP 2</p>
                        <p className="text-sm text-black">Location</p>
                    </div>
                    {/* step 3 label */}
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-400">STEP 3</p>
                        <p className="text-sm text-black">Additional</p>
                    </div>
                </div>
            </div>

            {currentStep === SearchStep.One && <StepOneContent triggerNewPrescription={triggerNewPrescription}/>}
            {currentStep === SearchStep.Two && <StepTwoContent />}
            {currentStep === SearchStep.Three && <StepThreeContent />}

            {/* next button */}
            <button onClick={nextStep} className="mt-5 bg-black text-white px-4 py-2 rounded-full self-end w-auto">
                Next
            </button>
        </div>
    </div>
    );
};

export default NewSearchModal;
