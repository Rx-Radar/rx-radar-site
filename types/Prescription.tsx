

/**
 * Prescription type
 */
export interface Prescription {
    name: string; // medication name
    dosage: string; // medication dosage 
    brand: string; // brand - generic - either
    quantity: string; // medication quantity
    type: string; // XR - IR - none
}