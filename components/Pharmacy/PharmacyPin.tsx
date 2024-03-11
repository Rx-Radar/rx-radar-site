import React, { useEffect, useState, useRef } from 'react';
import { OverlayViewF, OverlayView } from '@react-google-maps/api';

import { Pharmacy } from './Pharmacy';
import styles from "./PharmacyPin.module.css";

// props for PharmacyPin
interface PharmacyPinProps {
    pharmacy: Pharmacy;
    onPharmacyPinClick: (pharmacy: Pharmacy, event: any) => void;
}

/**
 * PharmacyPin
 * @param param PharmacyPinProps 
 * @returns OverlayViewF
 */
export const PharmacyPin: React.FC<PharmacyPinProps> = ({ pharmacy, onPharmacyPinClick }) => {

    const dynamicStyle = {
        borderRadius: 10, 
        border: pharmacy.selected ? '3px solid #000000' : '2px solid #C0C0C0', 
        opacity: 0.9, 
        paddingLeft: 20, 
        paddingRight: 20, 
        paddingTop: 10, 
        paddingBottom: 10, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
    };

    return (
        <OverlayViewF
        position={pharmacy.location}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div className={styles.pharmacyPin} style={dynamicStyle} onClick={(event) => onPharmacyPinClick(pharmacy, event)}>
                <div>
                    {/* pharmacy name */}
                    <h2 style={{color: 'black'}}>{pharmacy.name}</h2>
                    {/* medication status */}
                    <div style={{display: 'inline-flex', alignItems: 'center', marginTop: 2}}>
                        <div style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'green'}}/>
                        <h3 style={{color: 'black', marginLeft: 5}}>available</h3>
                    </div>
                </div>
            </div>
        </OverlayViewF>
    ); 
}
