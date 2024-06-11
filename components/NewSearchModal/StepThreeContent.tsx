import { useState } from 'react';

const StepTwoContent = () => {
    const [selectedOption, setSelectedOption] = useState('personal');

    return (
        <div className="flex flex-col w-full justify-center pt-4">
            <h2 className="text-xl font-semibold mb-4">Search Options</h2>
            <div className="flex flex-col space-y-4">
                <label className="flex items-center space-x-3">
                    <div
                    className={`w-5 h-5 rounded-full cursor-pointer border-2 ${selectedOption === 'personal' ? 'bg-black border-black' : 'border-gray-300'}`}
                    onClick={() => setSelectedOption('personal')}
                    ></div>
                    <span className="text-gray-700">Personal Search</span>
                </label>
                <label className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full cursor-not-allowed border-2 ${selectedOption === 'community' ? 'bg-black border-black' : 'border-gray-300'}`}></div>
                    <span className="text-gray-400">Community Map Search</span>
                    <div className=''>
                        *Coming Soon
                    </div>
                </label>
            </div>
        </div>
    );
};

export default StepTwoContent;
