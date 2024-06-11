import React, { useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Router, { useRouter } from 'next/navigation';



interface Document {
  location: string;
  description: string;
  author: string;
  views: number;
}

const cards = [
  {
      "location": "New York, NY",
      "description": "A guide on starting with the basics of your first platform.",
      "author": "Jane Doe",
      "views": 3500
  },
  {
      "location": "Los Angeles, CA",
      "description": "Understanding the basic concepts of web design.",
      "author": "John Smith",
      "views": 2700
  },
  {
      "location": "Chicago, IL",
      "description": "The practical guide to modern animation techniques.",
      "author": "Emily Johnson",
      "views": 4200
  },
  {
      "location": "Houston, TX",
      "description": "A quick tutorial on creating a blog theme.",
      "author": "David Lee",
      "views": 5400
  },
  {
      "location": "Phoenix, AZ",
      "description": "The best practices for creating a parallax WordPress theme.",
      "author": "Chris Green",
      "views": 4100
  },
  {
      "location": "Philadelphia, PA",
      "description": "Step-by-step guide to creating a vector penguin character.",
      "author": "Sophia Brown",
      "views": 3200
  },
  {
      "location": "San Antonio, TX",
      "description": "Learn the basics of using the Mesh tool in Illustrator.",
      "author": "Liam Martinez",
      "views": 3800
  }
  ];

type SearchesPageProps = {
  setShowNewSearchModal: (visible: boolean) => void;
};
  
export default function SearchesPage({ setShowNewSearchModal }: SearchesPageProps) {

  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    setDocuments(cards);
  }, []);

  return (
    <>
      {/* main page contents */}
      <div className="flex-grow overflow-y-auto">
          {/* recent searches title row */}
          <p className="text-3xl font-bold">My Searches</p>
            
          {/* recent searches title row */}
          <div className="flex flex-row justify-between w-full mt-6">
            <p className="text-xl font-medium">Select or create a new search to get started</p>
            <div className='text-gray-500 bg-[#E5E4E2] px-4 py-1 text-sm flex items-center rounded-full'>
                By Date
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            
            {/* create new search button */}
            <button onClick={() => setShowNewSearchModal(true)} className="group border border-gray-200 rounded-lg p-4 shadow-md w-full flex items-center justify-center stroke-black hover:stroke-white bg-white hover:bg-black transition-all duration-450 px-6 hover:px-8">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p className='text-white hidden group-hover:block group-hover:delay-1000 font-medium text-xl'>New</p>
            </button>

            {documents.map((doc, index) => (
                <DocumentCard key={index} document={doc} />
            ))}
          </div>
      </div>
    </>
  );
};

interface DocumentCardProps {
    document: Document;
}
  
const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const router = useRouter()

  function CardDropDownButton() {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="inline-flex justify-center rounded-md py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </MenuButton>

        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <MenuItem>
              {({ active }) => (
                <a
                  href="/settings"
                  className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <p>sdFA</p>
                  ) : (
                    <p>sdf</p>
                  )}
                  Settings
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <a
                  href="/support"
                  className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <p>ddd</p>
                  ) : (
                    <p>ddasd</p>
                  )}
                  Support
                </a>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    )
  }


  return (
    <div onClick={() => router.push('/search')} className="border border-gray-200 rounded-lg p-4 bg-white shadow-md w-full h-32 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        {/* medication name */}
        <span className="bg-green-100 text-green-800 text-xs font-medium px-4 py-2 rounded-full">
          Focalin
        </span>
        <div className="flex flex-row space-x-1 justify-center items-center">
          {/* date */}
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-4 py-2 rounded-full">
            5/12/24
          </span>
          {/* menu button */}
          <CardDropDownButton/>
        </div>
      </div>

      {/* location row */}
      <div className="flex items-center space-x-2 mt-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <p className="inline-flex text-xl font-semibold text-gray-900">
          {document.location}
        </p>
      </div>
    </div>
  );
};