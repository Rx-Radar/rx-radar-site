'use client';

import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';

// pages
import SearchesPage from './searches';
import SettingsScreen from './settings';
import PrescriptionsScreen from './prescriptions';

// modals
import NewSearchModal from '../../../components/NewSearchModal/NewSearchModal';
import NewPrescriptionModal from '../../../components/NewPrescriptionModal/NewPrescriptionModal';

enum Screen {
  Searches = "searches",
  Prescriptions = "prescriptions",
  Settings = "settings"
}

const Page: React.FC = () => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Searches);

  const [menuOpen, setMenuOpen] = useState(true);
  const [showNewSearchModal, setShowNewSearchModal] = useState<boolean>(false);
  const [showNewPrescriptionModal, setShowNewPrescriptionModal] = useState<boolean>(false);

  const triggerNewSearch = () => {
    setCurrentScreen(Screen.Searches);
    setShowNewSearchModal(true);
  }

  const triggerNewPresc = () => {
    setShowNewSearchModal(false);
    setCurrentScreen(Screen.Prescriptions);
    setShowNewPrescriptionModal(true);
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <div className="h-screen w-screen flex flex-grow bg-[#eeeeee] overflow-hidden">
    
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

        <div className="flex flex-col flex-grow overflow-hidden">
          <Header />
          <main className="flex-grow p-8 overflow-y-auto">
            
            {/* set main page content in here */}
            { currentScreen == Screen.Searches && <SearchesPage setShowNewSearchModal={setShowNewSearchModal} /> }
            { currentScreen == Screen.Settings && <SettingsScreen/> }
            { currentScreen == Screen.Prescriptions && <PrescriptionsScreen setShowNewPrescriptionsModal={setShowNewPrescriptionModal}/> }
          </main>
        </div>
      </div>

      {/* modal */}
      <NewSearchModal isOpen={showNewSearchModal} setIsOpen={setShowNewSearchModal} triggerNewPrescription={triggerNewPresc} />
      <NewPrescriptionModal isOpen={showNewPrescriptionModal} setIsOpen={setShowNewPrescriptionModal} />
    </>
  );
};

const Header: React.FC = () => {
  return (
    <div className="flex flex-row justify-end w-full bg-transparent px-5 py-3 z-10">
      {/* intentially empty header for now */}
      <div className='flex flex-row text-white stroke-white border-2 border-[#FF6D2C] space-x-2 py-1 px-2 rounded-full'>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M15 9H15.01M9 9H9.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <p>My Account</p>
      </div>
    </div>
  );
};

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentScreen: Screen;
  setCurrentScreen: React.Dispatch<React.SetStateAction<Screen>>;
}

const Menu: React.FC<MenuProps> = ({ menuOpen, setMenuOpen, setCurrentScreen, currentScreen }) => {
  return (
    <div className="flex-shrink-0">
      <button
        className="block md:hidden p-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
          <path d="M3 12h18M3 6h18M3 18h18"></path>
        </svg>
      </button>
      <Transition
        show={menuOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in duration-75 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="w-64 bg-[#E5E4E2] p-4 hidden md:flex md:flex-col md:justify-between md:h-full ">
          {/* top items */}
          <div>
            {/* rxradar logo */}
            <img
            style={{ width: 138, height: 31 }}
            src="/textlogo.png"
            alt="rxradar logo"
            className="object-cover w-full h-full mb-6"
            />

            {/* menu options */}
            <div className="flex flex-col space-y-2 items-start w-full">

              {/* searches page button */}
              <button 
              onClick={() => setCurrentScreen(Screen.Searches)} 
              className={classNames("py-2 w-full rounded-md text-left px-3 stroke-black flex flex-row space-x-2", 
                { 'bg-black shadow-md text-white transition ease-in duration-100 stroke-white': currentScreen == Screen.Searches }
              )}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>Searches</p>
              </button>

              {/* prescriptions page button */}
              <button 
              onClick={() => setCurrentScreen(Screen.Prescriptions)} 
              className={classNames("py-2 w-full rounded-md text-left px-3 stroke-black flex flex-row space-x-2", 
                { 'bg-black shadow-md text-white transition ease-in duration-100 stroke-white': currentScreen == Screen.Prescriptions }
              )}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 11.5H14.5L13 14.5L11 8.5L9.5 11.5H8.5M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.75009 14.4724 8.97129 18.311 10.948 20.0749C11.3114 20.3991 11.4931 20.5613 11.7058 20.6251C11.8905 20.6805 12.0958 20.6805 12.2805 20.6251C12.4932 20.5613 12.6749 20.3991 13.0383 20.0749C15.015 18.311 19.2362 14.4724 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>Prescriptions</p>
              </button>

              {/* settings button */}
              <button 
              onClick={() => setCurrentScreen(Screen.Settings)}
              className={classNames("py-2 w-full rounded-md text-left px-3 stroke-black flex flex-row space-x-2", 
                { 'bg-black shadow-md text-white transition ease-in duration-100 stroke-white': currentScreen == Screen.Settings }
              )}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.3951 19.3711L9.97955 20.6856C10.1533 21.0768 10.4368 21.4093 10.7958 21.6426C11.1547 21.8759 11.5737 22.0001 12.0018 22C12.4299 22.0001 12.8488 21.8759 13.2078 21.6426C13.5667 21.4093 13.8503 21.0768 14.024 20.6856L14.6084 19.3711C14.8165 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5678 17.8941 17.0784 17.9478L18.5084 18.1C18.9341 18.145 19.3637 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8715 16.635 20.9735 16.2103 20.9511 15.7829C20.9286 15.3555 20.7825 14.9438 20.5307 14.5978L19.684 13.4344C19.3825 13.0171 19.2214 12.5148 19.224 12C19.2239 11.4866 19.3865 10.9864 19.6884 10.5711L20.5351 9.40778C20.787 9.06175 20.933 8.65007 20.9555 8.22267C20.978 7.79528 20.8759 7.37054 20.6618 7C20.4479 6.62923 20.131 6.32849 19.7496 6.13423C19.3681 5.93997 18.9386 5.86053 18.5129 5.90556L17.0829 6.05778C16.5722 6.11141 16.0577 6.00212 15.6129 5.74556C15.17 5.48825 14.82 5.09736 14.6129 4.62889L14.024 3.31444C13.8503 2.92317 13.5667 2.59072 13.2078 2.3574C12.8488 2.12408 12.4299 1.99993 12.0018 2C11.5737 1.99993 11.1547 2.12408 10.7958 2.3574C10.4368 2.59072 10.1533 2.92317 9.97955 3.31444L9.3951 4.62889C9.18803 5.09736 8.83798 5.48825 8.3951 5.74556C7.95032 6.00212 7.43577 6.11141 6.9251 6.05778L5.49066 5.90556C5.06499 5.86053 4.6354 5.93997 4.25397 6.13423C3.87255 6.32849 3.55567 6.62923 3.34177 7C3.12759 7.37054 3.02555 7.79528 3.04804 8.22267C3.07052 8.65007 3.21656 9.06175 3.46844 9.40778L4.3151 10.5711C4.61704 10.9864 4.77964 11.4866 4.77955 12C4.77964 12.5134 4.61704 13.0137 4.3151 13.4289L3.46844 14.5922C3.21656 14.9382 3.07052 15.3499 3.04804 15.7773C3.02555 16.2047 3.12759 16.6295 3.34177 17C3.55589 17.3706 3.8728 17.6712 4.25417 17.8654C4.63554 18.0596 5.06502 18.1392 5.49066 18.0944L6.92066 17.9422C7.43133 17.8886 7.94587 17.9979 8.39066 18.2544C8.83519 18.511 9.18687 18.902 9.3951 19.3711Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6568 15 15 13.6569 15 12C15 10.3431 13.6568 9 12 9C10.3431 9 8.99998 10.3431 8.99998 12C8.99998 13.6569 10.3431 15 12 15Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>Settings</p>
              </button>
            </div>
          </div>

          {/* bottom items */}
          <div className="flex flex-col space-y-2 mb-4">
            
            <div className="flex flex-row space-x-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <a href="#" className="text-gray-700 hover:text-gray-900">Logout</a>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};


export default Page;
