
// geolocation object
export interface Location {
    lat: number;
    lng: number;
}

// pharmacy interface
export interface Pharmacy {
    id: number;
    name: string; 
    location: Location;
    phone: string;
    selected: boolean;
}