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
        <div className={styles.navigation_bar}>
            {/* logo */}
            <RxRadarLogo/>

            {/* default: menu options */}
            <div className={styles.menu_options}>
                <p>About</p>
                <p>Contact</p>
                <p>Pricing</p>
                <RxRadarLogoTarget size={40}/>
            </div>

            {/* mobile only: menu button */}
            <button className={styles.menu_button}>
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H15M3 6H21M3 18H21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

        </div>
    );

}