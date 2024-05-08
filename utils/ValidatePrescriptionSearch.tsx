import { Prescription } from "../types/Prescription";
import { PrescriptionSearch } from "../types/PrescriptionSearch";


// return true if search within pharmacy hours
export const isValidSearchTime = (): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check if current time falls within either of the ranges 8:05 am to 1:15:pm , 2:05: pm to 8:55 pm
    if (
        (currentHour === 8 && currentMinute >= 5) || // Morning range: 8:05am - 1:15pm
        (currentHour > 8 && currentHour < 13) ||
        (currentHour === 13 && currentMinute <= 15) || 
        (currentHour === 14 && currentMinute >= 5) || // Afternoon range: 2:05pm - 8:55pm
        (currentHour > 14 && currentHour < 20) || 
        (currentHour === 20 && currentMinute <= 55)
    ) {
        return true;
    }

    return false;
}


/**
 * validates prescription search form
 * @param prescriptionSearch 
 * @returns 
 */
export const validatePrescriptionSearch = (prescriptionSearch: PrescriptionSearch): { success: boolean, error: string | undefined, newPrescriptionSearch: PrescriptionSearch | undefined } => {
    // validate phone number
    if (!validatePhoneNumber(prescriptionSearch.phoneNumber)) {
        return { success: false, error: 'invalid phone number', newPrescriptionSearch: undefined };
    }

    // validate location
    if (!validateLocation(prescriptionSearch.location)) {
        return { success: false, error: 'invalid location', newPrescriptionSearch: undefined };
    }

    // validate/format prescription
    const { success, error, updatedPrescription } = validateAndFormatPrescription(prescriptionSearch.prescription);
    if (!success) {
        return { success: false, error: error, newPrescriptionSearch: undefined }
    }

    // create a new formatted prescription
    const newPrescriptionSearch: PrescriptionSearch = {
        phoneNumber: prescriptionSearch.phoneNumber,
        location: prescriptionSearch.location,
        prescription: updatedPrescription!
    }

    return { success: true, error: undefined, newPrescriptionSearch: newPrescriptionSearch} // on data valid return new prescription
}


/**
 * validates prescription search form, also converts from drop down to bland.ai speakable words i.e. "immediate release" instead of "IR"
 * @param prescription 
 * @returns 
 */
function validateAndFormatPrescription(prescription: Prescription): { success: boolean, error: string | undefined, updatedPrescription: Prescription | undefined }  {
    const types: { [key: string]: string } = {'IR': 'immediate release', 'XR': 'extended release', 'N/A': 'n/a'};
    const brands: { [key: string]: string } = {'Brand': 'Brand', 'Generic': 'Generic', 'Either': 'Either Brand or Generic'};
    const dosages: { [key: string]: string } = {'5mg': '5', '10mg': '10', '15mg': '15', '20mg': '20', '25mg': '25', '30mg': '30', '35mg': '35', '40mg': '40', '45mg': '45', '50mg': '50', '55mg': '55', '60mg': '60', '65mg': '65', '70mg': '70', '75mg': '75', '80mg': '80', '85mg': '85'}

    const medications = ['Ritalin', 'Adderall', 'Focalin', 'Dexedrine', 'Daytrana', 'Vyvanse'];
    // const brands = ['Brand', 'Generic', 'Either'];
    const quantities = ['30', '60', '80', '100'];
    
    // takes in a key (user search value), a list to find the corresponding value in --> returns success, and error string or value corresponding to key
    function getValue(key: string, lookupList: { [key: string]: string }, field: string): { success: boolean, result: string } {
        const value = lookupList[key];

        if (!value) {
            return { success: false, result: `invalid ${field}`}
        }
        return { success: true, result: value };
    }

    // validate and reformat prescription dosage
    const { success: dosageSuccess, result: dosageResult} = getValue(prescription.dosage, dosages, 'dosage');
    if (!dosageSuccess) {
        return { success: false, error: dosageResult, updatedPrescription: undefined };
    }

    // validate and reformat prescription brand
    const { success: brandSuccess, result: brandResult} = getValue(prescription.brand, brands, 'brand');
    if (!brandSuccess) {
        return { success: false, error: brandResult, updatedPrescription: undefined };
    }

    // validate and reformat prescription type
    const { success: typeSuccess, result: typeResult } = getValue(prescription.type, types, 'type');
    if (!typeSuccess) {
        return { success: false, error: typeResult, updatedPrescription: undefined };
    }

    if (!medications.includes(prescription.name)) {
        return { success: false, error: 'invalid medication name', updatedPrescription: undefined };
    }

    // update prescription to be formatted for bland speaking
    const updatedPrescription: Prescription = {
        name: prescription.name,
        dosage: dosageResult,
        brand: prescription.brand,
        quantity: prescription.quantity,
        type: typeResult
    };

    return { success: true, error: undefined, updatedPrescription: updatedPrescription };
}


// validate location
function validateLocation(location: string): boolean {
    const locations = ['Troy, NY', 'Boston, MA'];
    if (!locations.includes(location)) {
        return false;
    }
    return true;
}

// validate phone number
function validatePhoneNumber(phoneNumber: string): boolean {
    const regexPattern = /^\+1\d{10}$/; // regex format "+1xxxxxxxxxx"
    return regexPattern.test(phoneNumber);
}

