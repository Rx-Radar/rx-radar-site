import { useState } from 'react';


type StepOneContentProps = {
    triggerNewPrescription: () => void;
};

const StepOneContent: React.FC<StepOneContentProps> = ({ triggerNewPrescription }) => {
    const [selectedOption, setSelectedOption] = useState('personal');

    return (
        <div className="flex flex-col w-full justify-center pt-4">
            <h2 className="text-xl font-semibold mb-4">Select Prescription</h2>

            <div className='flex flex-row mt-1 space-x-2'>
                <div className="relative group">
                    <div onClick={triggerNewPrescription} className="flex items-center justify-center rounded-full bg-[#E5E4E2] stroke-black px-6 py-3 transition-all duration-450 hover:px-8 hover:bg-black hover:stroke-white">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="hidden ml-2 text-sm text-transparent group-hover:block group-hover:text-white">
                            Add Medication
                        </span>
                    </div>
                </div>

                <div className='text-[#4997D0] bg-[#B9D9EB] px-6 py-3 text-sm flex items-center rounded-full'>
                    Focalin
                </div>
                <div className='text-[#9F8170] bg-[#EFDECD] px-6 py-3 text-sm flex items-center rounded-full'>
                    Insulin
                </div>
            </div>
        </div>
    );
};

export default StepOneContent;
