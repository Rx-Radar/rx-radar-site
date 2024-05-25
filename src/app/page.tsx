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
  const HeroContent = () => {
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

        {/* ...rest of page content here */}
      </div>
    );
  };


  const Hero = () => {
    return (
      <div className="relative w-full overflow-hidden min-h-screen bg-[#eeeeee]">
        <FallingPillsBackground />
        <div className="relative top-40 md:top-60 left-auto transform-none flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-black text-center">
            Can't find ADHD meds?
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-black text-center">
            We 📞 pharmacies for you
          </h2>

          <button onClick={handleClick} className="mt-8 md:mt-20 px-6 py-3 bg-transparent border border-[#F94D00] rounded-full text-[#F94D00] font-semibold hover:bg-black hover:border-black hover:text-white transition duration-300 mx-auto">
            Get Started
          </button>
        </div>
      </div>
    );
  };
  


  // return main page contents
  return (
    <>
      <div className="h-screen w-screen flex flex-col overflow-y-auto">
        <NavigationBar />
        <Hero/>
        <HeroContent />
        <Footer />

        <PhoneVerificationModal showModal={showVerificationModal} setShowModal={setShowVerificationModal} sendSearchRequest={makeInitSearchPost}/>
      </div>

      { loading && <LoadingScreen /> }
      <div id="recaptcha"/>
      <ToastContainer />
    </>
  );
}
