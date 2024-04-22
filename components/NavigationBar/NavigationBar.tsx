import React, { useState, useRef, useEffect } from 'react';
import styles from './NavigationBar.module.css';

import RxRadarLogo from '@/app/images/RxRadarLogo';
import RxRadarLogoTarget from '@/app/images/RxRadarLogoTarget';


/**
 * SearchInput element allows for a filtered list
 * @returns Searchable Input
 */
export const NavigationBar = () => {



    return (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', backgroundColor: 'rgba(255, 153, 102, 0.2)', color: '#fff', backdropFilter: 'blur(20px)', padding: '10px 20px', zIndex: 1000, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <RxRadarLogo/>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 40, color: '#F94D00', fontWeight: '600', fontSize: 20}}>
                <p>About</p>
                <p>Contact</p>
                <p>Pricing</p>
                <RxRadarLogoTarget size={40}/>
            </div>
        </div>
    );

}