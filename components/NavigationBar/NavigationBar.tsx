import React, { useState, useRef, useEffect } from "react";
import styles from "./NavigationBar.module.css";

import RxRadarLogo from "@/app/images/RxRadarLogo";
import RxRadarLogoTarget from "@/app/images/RxRadarLogoTarget";

/**
 * SearchInput element allows for a filtered list
 * @returns Searchable Input
 */
export const NavigationBar = () => {
  return (
    <div className={styles.navigation_bar}>
      {/* logo */}
      <RxRadarLogo />

      {/* default: menu options */}
      <div className={styles.menu_options}>
        <RxRadarLogoTarget size={40} />
      </div>
    </div>
  );
};
