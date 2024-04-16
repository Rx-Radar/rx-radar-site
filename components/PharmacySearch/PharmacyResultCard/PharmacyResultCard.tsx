import { Tooltip } from "react-tooltip";
import styles from "./PharmacyResultCard.module.css"



/**
 * Pharmacy Result Card 
 * @param PharmacyResultCardProps
 * @returns Pharmacy Result Card 
 */
export const PharmacyResultCard = () => {

    return (
        <div className={styles.pharmacyResultCard}>
              
            {/* pharmacy name and phone number */}
            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                <div style={{flexDirection: 'column', display: 'flex'}}>
                  <h3 style={{color: 'black'}}>{'pharmacy.name'}</h3>
                  <p style={{fontSize: 15, fontWeight: '500', color: 'grey', marginTop: 2}}>{'pharmacy.phone'}</p>
                </div>

                {/* distance in miles */}
                <div style={{alignItems: 'center'}}>
                    <p style={{backgroundColor: '#CFE2FA', padding: 5, borderRadius: 8, fontWeight: '600', color: '#468FEA', border: '2px solid #468FEA'}}>5 mi</p>
                </div>
                
            </div>

            <div style={{display: 'flex', alignItems: 'center', marginTop: 10}}>
                <div className={styles.circlePulse}/>
                <p style={{color: 'black', marginLeft: 5}}>available</p>
            </div>    
        </div>
    );
}