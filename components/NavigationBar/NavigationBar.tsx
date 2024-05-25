"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./NavigationBar.module.css";
import Link from "next/link";

/**
 * SearchInput element allows for a filtered list
 * @returns Searchable Input
 */
export const NavigationBar = () => {
  return (
    <div className="w-full text-white bg-transparent px-5 py-2.5 z-10 flex flex-row justify-between items-center">
      {/* logo */}
      <Link href="/">
        <img
        style={{width: 170, height: 38}}
        src="/textlogo.png"
        alt="Boston Map"
        className="object-cover w-full h-full filter"
        /> 
      </Link>

      {/* default: menu options */}
      <div className="mx-10 space-x-2 hidden md:flex">
        <Link href="/pricing" className="text-black px-3 py-2 hover:text-white hover:bg-black hover:rounded-full">
          pricing
        </Link>
        <Link href="/about" className="text-black px-3 py-2 hover:text-white hover:bg-black hover:rounded-full">
          about
        </Link>
        <Link href="/contact" className="text-black px-3 py-2 hover:text-white hover:bg-black hover:rounded-full">
          contact us
        </Link>
      </div>

    </div>
  );
};
