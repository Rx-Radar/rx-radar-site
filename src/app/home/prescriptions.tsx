import React, { useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Router, { useRouter } from 'next/navigation';

interface Prescription {
  name: string;
  dosage: string;
  type: string;
  quantity: string;
}

type PrescriptionsPageProps = {
  setShowNewPrescriptionsModal: (visible: boolean) => void;
};

export default function PrescriptionsPage({ setShowNewPrescriptionsModal }: PrescriptionsPageProps) {
  const [documents, setDocuments] = useState<Prescription[]>([]);

  useEffect(() => {
    setDocuments([
        {
            name: "New York, NY",
            dosage: "A guide on starting with the basics of your first platform.",
            type: "Jane Doe",
            quantity: "3500"
        },
        {
            name: "New York, NY",
            dosage: "A guide on starting with the basics of your first platform.",
            type: "Jane Doe",
            quantity: "3500"
        }
        ]);
  }, []);

  return (
    <div className="flex-grow overflow-y-auto">
        {/* recent searches title row */}
        <p className="text-3xl font-bold">My Prescriptions</p>

        {/* add new prescription */}
        <div className="flex flex-row w-full mt-6">
          <p className="text-xl font-medium">Select or create a new search to get started</p>
        </div>

        <div className='flex flex-row mt-10 space-x-2'>
          <div className="relative group">
            <div className="flex items-center justify-center rounded-full bg-[#E5E4E2] stroke-black px-6 py-3 transition-all duration-450 hover:px-8 hover:bg-black hover:stroke-white">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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