// index page
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import axios from "axios";

// npm inports
import "react-international-phone/style.css";
import ReactInputVerificationCode from "react-input-verification-code";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// local inports
import { NavigationBar } from "../../components/NavigationBar/NavigationBar";
import QuantumLoader from "../../components/LoaderAnimations/QuantumLoader/QuantumLoader";
import RxRadarLogoBeacon from "./images/RxRadarLogoBeacon";
import {
  setupRecaptcha,
  sendSMSVerification,
  signUserIn,
} from "../../utils/AuthVerifier";
import { PrescriptionSearchForm } from "../../components/PrescriptionSearchForm/PrescriptionSearchFormProps";
import {
  validatePrescriptionSearch,
  isValidSearchTime,
} from "../../utils/ValidatePrescriptionSearch";

// import types
import { PrescriptionSearch } from "../../types/PrescriptionSearch";

export default function Index() {
  const navigation = useRouter(); // navigation router

  const [loading, setLoading] = useState<boolean>(false);
  const [prescriptionSearch, setPrescriptionSearch] =
    useState<PrescriptionSearch>();

  // user search process state
  type SearchState = "START" | "VERIFICATION_SENT" | "SEARCH_STARTED";
  const [searchState, setSearchState] = useState<SearchState>("START");

  // on page load setup
  useEffect(() => {
    setupRecaptcha();
  }, []);

  // triggers medication search
  const initializeMedicationSearch = (
    prescriptionSearch: PrescriptionSearch
  ) => {
    setLoading(true);

    // check if search is within pharmacy hours
    if (!isValidSearchTime()) {
      toast.error("Try searching during pharmacy hours", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const { success, error, newPrescriptionSearch } =
      validatePrescriptionSearch(prescriptionSearch);
    if (!success) {
      // user filled some part of the form wrong
      toast.error(error, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    sendSMSVerification(prescriptionSearch.phoneNumber)
      .then((successMessage) => {
        setSearchState("VERIFICATION_SENT");
        setLoading(false);
      })
      .catch((error) =>
        console.error("Error sending SMS verification:", error)
      );

    // set local prescriptionSearch
    setPrescriptionSearch(newPrescriptionSearch);
  };

  // verifies sms auth on user enter code completion
  const verifyCodeEntered = (code: string) => {
    signUserIn(code)
      .then((userSessionToken) => {
        setSearchState("SEARCH_STARTED");
        makeInitSearchPost(userSessionToken);
      })
      .catch((error) => console.log(error));
  };

  // calls init-search-bland endpoint to initiate prescription search
  async function makeInitSearchPost(userSessionToken: string) {
    const url =
      "https://us-central1-rxradar.cloudfunctions.net/init-search-bland-cloudtask"; // calls init-search-bland [[MVP]]

    if (!prescriptionSearch) {
      toast.error("woah, somethings not working. Try searching again", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
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

      console.log("Response:", response.data);
      console.log("Status:", response.status);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      toast.error("whoah, somethings not working. Try searching again", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  // main hero content with medication search form
  const HeroContent = () => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          overflowY: "auto",
          flexDirection: "column",
        }}
      >
        {/* main row contents */}
        <div className={styles.hero_content}>
          {/* left box (content) */}
          <div className={styles.hero_text_container}>
            <p style={{ color: "#FB4E00" }}>Meds in shortage?</p>
            <p>We find a nearby pharmacy that has them</p>
            <p style={{ color: "#FB4E00" }}>Then we'll text you in ~10</p>
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

  // verification code entry page
  const VerificationContent = () => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "white",
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <p className={styles.enter_verification_code_text}>
          Enter SMS verification code to continue
        </p>

        <div className={styles.input_verification}>
          <ReactInputVerificationCode
            length={6}
            autoFocus={true}
            placeholder=""
            onCompleted={(code) => verifyCodeEntered(code)}
          />
        </div>
      </div>
    );
  };

  // displays search sent page
  const SearchSentContent = () => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#FBCEB1",
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className={styles.hero_text_container}>
          <p style={{ color: "black" }}>Searching for meds!</p>
          <p style={{ color: "#F94D00" }}>We'll text you soon</p>
        </div>
      </div>
    );
  };

  // loading screen
  const Loader = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <QuantumLoader />
        <p style={{ marginTop: 28 }}>Sending Phone Verification</p>
      </div>
    );
  };

  // add your contact information here
  const email = "rxradarcontact@gmail.com"; // Set your email address here
  // Footer component for displaying contact information
  const FooterBar = () => {
    return (
      <div className={styles.footer}>
        <u>
          <a href={`mailto:${email}`}>{email}</a>
        </u>
      </div>
    );
  };

  // return main page contents
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "black",
      }}
    >
      <NavigationBar />

      {searchState == "START" && <HeroContent />}
      {searchState == "VERIFICATION_SENT" && <VerificationContent />}
      {searchState == "SEARCH_STARTED" && <SearchSentContent />}

      <div id="recaptcha"></div>
      <ToastContainer />
      <FooterBar />
    </div>
  );
}
