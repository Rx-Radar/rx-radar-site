// index page
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import axios from "axios";

// npm inports
import "react-international-phone/style.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// local inports
import { NavigationBar } from "../../components/NavigationBar/NavigationBar";
import { setupRecaptcha, sendSMSVerification } from "../../utils/AuthVerifier";
import { PrescriptionSearchForm } from "../../components/PrescriptionSearchForm/PrescriptionSearchForm";
import { validatePrescriptionSearch } from "../../utils/ValidatePrescriptionSearch";
import PhoneVerificationModal from "../../components/PhoneVerificationModal/PhoneVerificationModal";
import { showToast } from "../../utils/DisplayToast";
import FallingPillsBackground from "../../components/FallingPillsBackground/FallingPillsBackground";
import Footer from "../../components/Footer/Footer";

// import types
import { PrescriptionSearch } from "../../types/PrescriptionSearch";
import QuantumLoader from "../../components/LoaderAnimations/QuantumLoader/QuantumLoader";
import { LoadingScreen } from "../../components/LoadingScreen/LoadingScreen";
import Head from "next/head";
import Link from "next/link";


export default function Index() {
  const navigation = useRouter(); // navigation router

  const [prescriptionSearch, setPrescriptionSearch] = useState<PrescriptionSearch>();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [searchRequestSent, setSearchRequestSent] = useState<boolean>(false);
  const searchFormSectionRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = () => {
    searchFormSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // on page load setup recaptcha
  useEffect(() => {
    setupRecaptcha();
  }, []);

  // push search success 
  useEffect(() => {
    if (searchRequestSent) {
      navigation.push('/search-success')
    }
  }, [searchRequestSent]);

  // triggers medication search on search form completion
  const initializeMedicationSearch = (prescriptionSearch: PrescriptionSearch) => {

    // validate prescription search
    const { success, error, newPrescriptionSearch } = validatePrescriptionSearch(prescriptionSearch);
    if (!success) {
      showToast('error', error);
      return;
    }

    setLoading(true); // set loading state to be true

    // set prescriptionSearch
    setPrescriptionSearch(newPrescriptionSearch);

    sendSMSVerification(prescriptionSearch.phoneNumber)
      .then((successMessage) => {
        setLoading(false);
        setShowVerificationModal(true);
      })
      .catch((error) =>
        console.error("Error sending SMS verification:", error)
      );
  };

  // calls init-search-bland endpoint to initiate prescription search
  async function makeInitSearchPost(userSessionToken: string) {
    const url = "https://us-central1-rxradar.cloudfunctions.net/prod-process-search-request"; // calls process-search-request

    if (!prescriptionSearch) {
      showToast('error', 'woah, somethings not working. Try again');
      return;
    }

    const body = {
      user_session_token: userSessionToken,
      phone_number: prescriptionSearch.phoneNumber,
      user_location: prescriptionSearch.location,
      prescription: {
        name: prescriptionSearch.prescription.name,
        dosage: prescriptionSearch.prescription.dosage,
        brand_or_generic: prescriptionSearch.prescription.brand,
        quantity: prescriptionSearch.prescription.quantity,
        type: prescriptionSearch.prescription.type,
      },
    };

    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // deconstruct return properties
      const { status, data } = response;
      const { searchStatus, message = "no error found" } = data; 
      console.log(searchStatus, message)

      if (status !== 200) {
        console.log('process search request failed')
        showToast('error', 'hmm. we couldn\'t place your search. Try again');
      }

      if (searchStatus == 'completed') {
        // Handle search placed case
        console.log('Search results:', message);
        setSearchRequestSent(true);
      } else if (searchStatus == 'not_paid') {
        // Handle payment required case
        console.log('Payment required:', message);
        window.location.href = `https://buy.stripe.com/4gw28v7Ja59ydnW9AA?client_reference_id=${message}`;
      }  

    } catch (error) {
      console.error("Error:", error);
      showToast('error', 'woah, somethings not working. Try again');
    }
  }

  // main hero content with medication search form
  const PrescriptionSearchSection = () => {
    return (
      <div ref={searchFormSectionRef} className="bg-[#eeeeee]">
        <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center md:space-x-14 space-y-14 md:space-y-0 p-5">

          {/* left box (content) */}
          <div className="flex flex-col justify-center items-center p-2 space-y-5 w-full text-center md:text-left md:max-w-[45%]">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
              <div className="text-4xl md:text-6xl">✍️</div>
              <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-2">
                <span className="text-2xl md:text-4xl font-bold">Enter your medication details.</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
              <div className="text-4xl md:text-6xl">🔎</div>
              <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-2">
                <span className="text-2xl md:text-4xl font-bold">We search your local area for pharmacies.</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
              <div className="text-4xl md:text-6xl">📞</div>
              <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-2">
                <span className="text-2xl md:text-4xl font-bold">We place calls using our AI assistant.</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
              <div className="text-4xl md:text-6xl">🗺️</div>
              <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-2">
                <span className="text-2xl md:text-4xl font-bold">We text you a link to view your search results.</span>
              </div>
            </div>
          </div>

          {/* right box (input form)*/}
          <PrescriptionSearchForm
          loading={false}
          initializeMedicationSearch={initializeMedicationSearch}
          />

        </div>
      </div>
    );
  };


  const HeroSection = () => {
    return (
      <div className="relative w-full overflow-hidden min-h-screen bg-[#eeeeee]">
        <FallingPillsBackground />
        <div className="relative top-40 md:top-60 left-auto transform-none flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black text-center">
            Can't find ADHD meds?
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center">
            We 📞 pharmacies for you
          </h2>

          <button onClick={handleClick} className="mt-8 md:mt-20 px-6 py-3 bg-transparent border border-[#F94D00] rounded-full text-[#F94D00] font-semibold hover:bg-black hover:border-black hover:text-white transition duration-300 mx-auto">
            Get Started
          </button>
        </div>
      </div>
    );
  };


  // const HowItWorksSection = () => {
  //   return (
  //     <div className="w-full px-3 py-12 bg-[#cccccc] flex flex-col items-center">
  //       <div className="text-black text-xl w-[80%] text-center">
  //         We understand the pains of needing medications that are in shortage. RxRadar automatically locates pharmacies in your area, calls on your behalf,
  //         and finds out if your prescription can be filled. We support a growing list of ADHD shortage affected medications, including Adderall, Vyvanse, and Ritalin.
  //       </div>
  //     </div>
  //   );

  // }

  const HowItWorksSection = () => {
    return (
      <div className="w-full px-5 md:px-16 py-12 bg-[#eeeeee] flex flex-col md:items-left">
        <p className="text-4xl font-bold text-center">💥 Chill Out, We’ve Got Your Meds Handled!</p>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 mt-16 md:space-x-4 min-h-72">
          
          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 flex flex-col justify-between">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9932 5.13581C9.9938 2.7984 6.65975 2.16964 4.15469 4.31001C1.64964 6.45038 1.29697 10.029 3.2642 12.5604C4.89982 14.6651 9.84977 19.1041 11.4721 20.5408C11.6536 20.7016 11.7444 20.7819 11.8502 20.8135C11.9426 20.8411 12.0437 20.8411 12.1361 20.8135C12.2419 20.7819 12.3327 20.7016 12.5142 20.5408C14.1365 19.1041 19.0865 14.6651 20.7221 12.5604C22.6893 10.029 22.3797 6.42787 19.8316 4.31001C17.2835 2.19216 13.9925 2.7984 11.9932 5.13581Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div className="mt-2">
              <h2 className="text-lg font-bold mb-2">We've been there</h2>
              <p className="text-black">
                We intimately understand what it's like manually locating and calling pharmacies to find medications. 
                We are striving to build a community that supports and helps one another access these critical prescriptions.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 flex flex-col justify-between">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>


            <div className="mt-2">
              <h2 className="text-lg font-bold mb-2">Expanding Availability</h2>
              <p className="text-gray-700">
                RxRadar supports many common ADHD shortage affected medications including Adderall, 
                Vyvanse, Focalin, Daytrana, and Ritalin. We are rapidly expanding our services each week!
              </p>
              <Link className="text-sm mt-8 text-[#118B5D]" href={new URL("https://forms.gle/YUuvJeVDiNb7Qdhr9")}>Click here to suggest more medications?</Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3 flex flex-col justify-between">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.84281 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>


            <div className="mt-2">
              <h2 className="text-lg font-bold mb-2">AI Powered</h2>
              <p className="text-gray-700">
                RxRadar leverages automated technology to pinpoint nearby pharmacies, 
                initiate direct communication on your behalf, and efficiently determine 
                if your prescription can be filled, ensuring a hassle-free experience.
              </p>
            </div>
          </div>
        </div>


        {/* <div className="text-black text-center md:text-left bg-blue-500 w-3/4 mt-6">
            <p className="text-lg md:text-xl font-bold text-[#F94D00]">What meds do you guys support?</p>
            <p className="mt-1 text-md md:text-md">
              We understand the pains of needing medications that are in shortage. RxRadar automatically locates pharmacies in your area, calls on your behalf,
              and finds out if your prescription can be filled. We support a growing list of ADHD shortage affected medications, including Adderall, Vyvanse, and Ritalin.
            </p>
        </div>

        <div className="w-1/3 p-4 border-2 mt-10 border-[#FBCEB1] flex flex-col justify-between rounded-lg">
          <p className="text-2xl font-medium">Per Search Pricing</p>
          
          <div>
            <p className="flex items-baseline">
              <span className="text-3xl font-bold">$5</span>
              <span className="text-md ml-2 text-[#cccccc]">0.5¢/pharmacy call</span>
            </p>
            
            <p className="mt-3 font-light">
              Access to a single search for a prescription of pharmacies in your area. 
              Our proprietary service will select optimal pharmacies, call and speak with pharmacists, 
              and send you a link with a detailed overview of each call.
              You will also be able to review search results on a dynamic map.
            </p>
          </div>
        </div> */}

      </div>
    );

  }
  

  // return main page contents
  return (
    <>
      {/* head SEO optimized content */}
      <Head>
        <title>RxRadar | Find In-Shortage Medications</title>
        <meta name="description" content="RX Radar helps you find medications in shortage by contacting pharmacies on your behalf." />
        <meta name="keywords" content="medication shortage, pharmacy stock, find medications, RX Radar" />
        <link rel="canonical" href="https://rx-radar.com/" />
      </Head>

      <div className="h-screen w-screen flex flex-col overflow-y-auto">
        <NavigationBar />
        <HeroSection />
        <HowItWorksSection />
        <PrescriptionSearchSection />
        <Footer />
      </div>


      <PhoneVerificationModal showModal={showVerificationModal} setShowModal={setShowVerificationModal} sendSearchRequest={makeInitSearchPost}/>
      { loading && <LoadingScreen /> }
      <ToastContainer />
      <div id="recaptcha" />
    </>
  );
}
