import { Pharmacy } from "../../Pharmacy/Pharmacy";
import styles from "./SelectedPharmacyCard.module.css";

interface SelectedPharmacyCardProps {
    pharmacy: Pharmacy
    onSelectPharmacy: () => void
}

export const SelectedPharmacyCard: React.FC<SelectedPharmacyCardProps> = ({ pharmacy, onSelectPharmacy}) => {
    return (
        <div style={{height: '100%', border: '2px solid #F2F3F4', width: '100%', borderRadius: 10, paddingTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, marginTop: 20, display: 'flex', flexDirection: 'column'}}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center', alignItems: 'center'}}>
                <svg onClick={() => onSelectPharmacy()} className={styles.backArrow} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h2 style={{color: 'black', width: '100%'}}>{pharmacy.name}</h2>
            </div>
        </div>
    );
}