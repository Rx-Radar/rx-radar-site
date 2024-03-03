import { Pharmacy } from "../../Pharmacy/Pharmacy";
import styles from "./SelectedPharmacyCard.module.css";

interface SelectedPharmacyCardProps {
    pharmacy: Pharmacy
    onSelectPharmacy: () => void
}

export const SelectedPharmacyCard: React.FC<SelectedPharmacyCardProps> = ({ pharmacy, onSelectPharmacy}) => {
    return (
        <div className={styles.selectedPharmacyCard}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'center', alignItems: 'center'}}>
                <svg onClick={() => onSelectPharmacy()} className={styles.backArrow} width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h2 style={{color: 'black', width: '100%'}}>{pharmacy.name}</h2>
            </div>

            {/* current medication status */}
            <div style={{marginTop: 20, width: '95%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                <div style={{padding: 8, backgroundColor: '#CFE2FA', border: '2px solid #468FEA', width: 'fit-content', borderRadius: 6, display: 'flex', alignItems: 'center',}}> 
                    <div style={{width: 14, height: 14, backgroundColor: 'green', borderRadius: 8}}/>
                    <p style={{marginLeft: 5, fontSize: 18, fontWeight: '700', color: '#468FEA'}}> currently available</p>
                </div>

                <div style={{display: 'flex', alignItems: 'center'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18.5H15M6.6 2H17.4C17.9601 2 18.2401 2 18.454 2.10899C18.6422 2.20487 18.7951 2.35785 18.891 2.54601C19 2.75992 19 3.03995 19 3.6V5.67452C19 6.1637 19 6.40829 18.9447 6.63846C18.8957 6.84254 18.8149 7.03763 18.7053 7.21657C18.5816 7.4184 18.4086 7.59135 18.0627 7.93726L15.1314 10.8686C14.7354 11.2646 14.5373 11.4627 14.4632 11.691C14.3979 11.8918 14.3979 12.1082 14.4632 12.309C14.5373 12.5373 14.7354 12.7354 15.1314 13.1314L18.0627 16.0627C18.4086 16.4086 18.5816 16.5816 18.7053 16.7834C18.8149 16.9624 18.8957 17.1575 18.9447 17.3615C19 17.5917 19 17.8363 19 18.3255V20.4C19 20.9601 19 21.2401 18.891 21.454C18.7951 21.6422 18.6422 21.7951 18.454 21.891C18.2401 22 17.9601 22 17.4 22H6.6C6.03995 22 5.75992 22 5.54601 21.891C5.35785 21.7951 5.20487 21.6422 5.10899 21.454C5 21.2401 5 20.9601 5 20.4V18.3255C5 17.8363 5 17.5917 5.05526 17.3615C5.10425 17.1575 5.18506 16.9624 5.29472 16.7834C5.4184 16.5816 5.59135 16.4086 5.93726 16.0627L8.86863 13.1314C9.26465 12.7354 9.46265 12.5373 9.53684 12.309C9.6021 12.1082 9.6021 11.8918 9.53684 11.691C9.46266 11.4627 9.26464 11.2646 8.86863 10.8686L5.93726 7.93726C5.59136 7.59136 5.4184 7.4184 5.29472 7.21657C5.18506 7.03763 5.10425 6.84254 5.05526 6.63846C5 6.40829 5 6.1637 5 5.67452V3.6C5 3.03995 5 2.75992 5.10899 2.54601C5.20487 2.35785 5.35785 2.20487 5.54601 2.10899C5.75992 2 6.03995 2 6.6 2Z" stroke="gray" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p style={{fontSize: 15, color: 'gray', marginLeft: 2}}>updated 30 sec ago...</p>
                </div>
            </div>

            {/* pharmacy information */}
            <div style={{width: '95%', marginTop: 20,}}>
                <div style={{backgroundColor: '#F5F5F5', borderRadius: 8, marginTop: 5, padding: 10}}>
                    <div style={{display: 'flex', marginTop: 5, alignItems: 'center'}}>
                        <p style={{fontSize: 16, fontWeight: '600'}}>Pharmacy Number:</p>
                        <p style={{fontSize: 16, marginLeft: 5}}>(203) 678 5146</p>
                        
                        <svg width="24" height="24" style={{border: '2px solid #000000', borderRadius: 5, padding: 4, width: 30, height: 30}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 4C16.93 4 17.395 4 17.7765 4.10222C18.8117 4.37962 19.6204 5.18827 19.8978 6.22354C20 6.60504 20 7.07003 20 8V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V8C4 7.07003 4 6.60504 4.10222 6.22354C4.37962 5.18827 5.18827 4.37962 6.22354 4.10222C6.60504 4 7.07003 4 8 4M9.6 6H14.4C14.9601 6 15.2401 6 15.454 5.89101C15.6422 5.79513 15.7951 5.64215 15.891 5.45399C16 5.24008 16 4.96005 16 4.4V3.6C16 3.03995 16 2.75992 15.891 2.54601C15.7951 2.35785 15.6422 2.20487 15.454 2.10899C15.2401 2 14.9601 2 14.4 2H9.6C9.03995 2 8.75992 2 8.54601 2.10899C8.35785 2.20487 8.20487 2.35785 8.10899 2.54601C8 2.75992 8 3.03995 8 3.6V4.4C8 4.96005 8 5.24008 8.10899 5.45399C8.20487 5.64215 8.35785 5.79513 8.54601 5.89101C8.75992 6 9.03995 6 9.6 6Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </div>
                    <div style={{display: 'flex', marginTop: 5}}>
                        <p style={{fontSize: 16, fontWeight: '600'}}>Address:</p>
                        <p style={{fontSize: 16, marginLeft: 5}}>10 Hillside Ave, Norwalk CT</p>
                    </div>
                </div>

            </div>

            {/* medication status */}
            <div style={{width: '95%', marginTop: 20, display: 'flex', flexDirection: 'column'}}>
                <h3>Availability History</h3>
                <div style={{height: 200, backgroundColor: '#F5F5F5', borderRadius: 8, padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
                    { listHistory.map((value, index) => {
                        return <TestHistoryComponent key={index} available={value}/>
                    })}
                </div>
            </div>
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
                <p style={{fontSize: 16, marginLeft: 5,}}> available yesterday</p>
            </div>
            <div style={{width: '100%', height: 1, backgroundColor: 'lightgray', marginTop: 5}}/>
        </div>
    );
}