import { Prescription } from "./Prescription"
import { SearchLocation } from "./SearchLocation";

/**
 * Prescription Search
 */
export type PrescriptionSearch = {
    prescription: Prescription; // user prescription
    phoneNumber: string; // user phone number 
    location: SearchLocation | undefined; // user search location 
} 