import { useState } from "react";
import { Pharmacy } from "../../Pharmacy/Pharmacy";
import styles from "./SelectedPharmacyCard.module.css";

import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SelectedPharmacyCardProps {
    pharmacy: Pharmacy
    onSelectPharmacy: () => void
}

export const SelectedPharmacyCard: React.FC<SelectedPharmacyCardProps> = ({ pharmacy, onSelectPharmacy}) => {
    const [availabilityExpanded, setAvailabilityExpanded] = useState<boolean>(false);

    const notifyCopyToClipboard = () => toast('Copied to clipboard', {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });


    const AvailabilityExpandingComponent = () => {
        if (availabilityExpanded) {
            return (
                <div style={{marginTop: 8, width: '95%', display: 'flex', flexDirection: 'column', backgroundColor: '#F5F5F5', padding: 8, borderRadius: 8}}>
                    {/* header */}
                    <div onClick={() => setAvailabilityExpanded(false)} style={{width: '100%', justifyContent: 'space-between', display: 'flex', height: 'fit-content'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                            <p style={{fontWeight: '600', color: 'black', fontSize: 20}}>medication</p>
                            <p style={{fontSize: 16, fontWeight: '700', color: '#468FEA', padding: 4, backgroundColor: '#CFE2FA', border: '2px solid #468FEA', borderRadius: 8}}>available</p>
                        </div>

                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>

                    {/* information */}
                    <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                        <p style={{fontSize: 14, color: 'black', paddingLeft: 2}}>This medication is most likely still in stock at this location!</p>
                    </div>

                    {/* last updated */}
                    <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p style={{fontSize: 14, color: 'gray', paddingLeft: 2}}>updated earlier today</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div onClick={() => setAvailabilityExpanded(true)} style={{marginTop: 8, width: '95%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 8, borderRadius: 8}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                        <p style={{fontWeight: '600', color: 'black', fontSize: 20}}>medication</p>
                        <p style={{fontSize: 16, fontWeight: '700', color: '#468FEA', padding: 4, backgroundColor: '#CFE2FA', border: '2px solid #468FEA', borderRadius: 8}}>available</p>
                    </div>

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            );
        }
    }

    return (
        <div className={styles.selectedPharmacyCard}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center', alignItems: 'center'}}>
                <svg onClick={() => onSelectPharmacy()} className={styles.backArrow} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            

            <h2 style={{color: 'black', width: '95%', marginTop: 8}}>{pharmacy.name}</h2>

            {/* current medication status */}
            <AvailabilityExpandingComponent/>

            {/* pharmacy information */}
            <div onClick={notifyCopyToClipboard} className={styles.copyToClipboardInfo}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.38028 8.85335C9.07627 10.303 10.0251 11.6616 11.2266 12.8632C12.4282 14.0648 13.7869 15.0136 15.2365 15.7096C15.3612 15.7694 15.4235 15.7994 15.5024 15.8224C15.7828 15.9041 16.127 15.8454 16.3644 15.6754C16.4313 15.6275 16.4884 15.5704 16.6027 15.4561C16.9523 15.1064 17.1271 14.9316 17.3029 14.8174C17.9658 14.3864 18.8204 14.3864 19.4833 14.8174C19.6591 14.9316 19.8339 15.1064 20.1835 15.4561L20.3783 15.6509C20.9098 16.1824 21.1755 16.4481 21.3198 16.7335C21.6069 17.301 21.6069 17.9713 21.3198 18.5389C21.1755 18.8242 20.9098 19.09 20.3783 19.6214L20.2207 19.779C19.6911 20.3087 19.4263 20.5735 19.0662 20.7757C18.6667 21.0001 18.0462 21.1615 17.588 21.1601C17.1751 21.1589 16.8928 21.0788 16.3284 20.9186C13.295 20.0576 10.4326 18.4332 8.04466 16.0452C5.65668 13.6572 4.03221 10.7948 3.17124 7.76144C3.01103 7.19699 2.93092 6.91477 2.9297 6.50182C2.92833 6.0436 3.08969 5.42311 3.31411 5.0236C3.51636 4.66357 3.78117 4.39876 4.3108 3.86913L4.46843 3.7115C4.99987 3.18006 5.2656 2.91433 5.55098 2.76999C6.11854 2.48292 6.7888 2.48292 7.35636 2.76999C7.64174 2.91433 7.90747 3.18006 8.43891 3.7115L8.63378 3.90637C8.98338 4.25597 9.15819 4.43078 9.27247 4.60655C9.70347 5.26945 9.70347 6.12403 9.27247 6.78692C9.15819 6.96269 8.98338 7.1375 8.63378 7.4871C8.51947 7.60142 8.46231 7.65857 8.41447 7.72538C8.24446 7.96281 8.18576 8.30707 8.26748 8.58743C8.29048 8.66632 8.32041 8.72866 8.38028 8.85335Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p style={{fontSize: 16, marginLeft: 5, fontWeight: '500', color: 'black'}}>(203) 678 5146</p>
            </div>

            <div onClick={() => {
                notifyCopyToClipboard();
                console.log('running');
            }} className={styles.copyToClipboardInfo}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 21V15.6C15 15.0399 15 14.7599 14.891 14.546C14.7951 14.3578 14.6422 14.2049 14.454 14.109C14.2401 14 13.9601 14 13.4 14H10.6C10.0399 14 9.75992 14 9.54601 14.109C9.35785 14.2049 9.20487 14.3578 9.10899 14.546C9 14.7599 9 15.0399 9 15.6V21M3 7C3 8.65685 4.34315 10 6 10C7.65685 10 9 8.65685 9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7C15 8.65685 16.3431 10 18 10C19.6569 10 21 8.65685 21 7M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.71569 20.2843 3.40973 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H6.2C5.0799 3 4.51984 3 4.09202 3.21799C3.71569 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.07989 3 6.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p style={{fontSize: 16, marginLeft: 5, fontWeight: '500', color: 'black'}}>10 Hillside Ave, Norwalk CT</p>
            </div>
            <ToastContainer />
        </div>
    );
}

// below this is all for test displaying medication check history list
const listHistory = [1, 1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1];

interface testHistoryComponent {
    available: number;
}
const TestHistoryComponent : React.FC<testHistoryComponent> = ({available}) => {

    const dynamicStyle = {
        backgroundColor: available == 1 ? 'green' : 'red',
        width: 12,
        height: 12, 
        borderRadius: 6,
    }
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', marginTop: 8, alignItems: 'center'}}>
                <div style={dynamicStyle}/>
                <p style={{fontSize: 16, marginLeft: 5, color: 'gray'}}> available yesterday</p>
            </div>
            <div style={{width: '100%', height: 1, backgroundColor: 'lightgray', marginTop: 5}}/>
        </div>
    );
}