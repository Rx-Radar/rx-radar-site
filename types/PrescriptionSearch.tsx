import { Prescription } from "./Prescription"

/**
 * Prescription Search
 */
export type PrescriptionSearch = {
    prescription: Prescription; // user prescription
    phoneNumber: string; // user phone number 
    location: string; // user search location 
}