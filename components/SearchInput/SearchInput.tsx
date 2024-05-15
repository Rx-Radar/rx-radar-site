import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import styles from './SearchInput.module.css';
import Fuse from 'fuse.js';
import Link from 'next/link';

// search input props
interface SearchInputProps {
    placeholder: string; 
    searchList: string[]; // list of search results to display
    onChange: (value: string) => void; // function called on input option changed
    bottomSearchLink?: URL; // displays on the bottom of the search results as a default text
    bottomSearchText?: string; // text to display over the link in the bottom of the search
}

/**
 * SearchInput element allows for a filtered list
 * @param SearchInputProps 
 * @returns Searchable Input
 */
export const SearchInput:React.FC<SearchInputProps> = ({ searchList, placeholder, onChange, bottomSearchLink, bottomSearchText }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false); // stores whether the user has focused the text input
    const [currentText, setCurrentText] = useState<string>(''); // stores the current text the user is typing
    const [filteredResults, setFilteredResults] = useState<string[]>(searchList); // filtered list
    
    const inputRef = useRef<HTMLInputElement>(null); // input reference
    const resultsRef = useRef<HTMLDivElement>(null); // search results reference

    // fuzzy search parameters
    const options = { includeScore: true }
    const fuse = new Fuse(searchList, options)

    // updates onChange when current text changed
    useEffect(() => {
        onChange(currentText);
    }, [currentText]);


    // update input text and filter fuzzy search result
    const fuzzySearchFilter = (input: string) => {
        setCurrentText(input);
        const fuzzySearchResults = fuse.search(input).slice(0, 6);
        
        if (fuzzySearchResults.length > 0) {
            setFilteredResults(fuzzySearchResults.map(result => result.item));
        }
    }

    // on user select enter key select top item
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            setCurrentText(filteredResults[0]);
            fuzzySearchFilter(filteredResults[0]);
            setIsFocused(false);
            if (inputRef.current) inputRef.current.blur(); // hide the input
        }
    };

    // on list item select
    const listItemSelect = (item: string) => {
        fuzzySearchFilter(item);
        setCurrentText(item);
        setIsFocused(false);
    }

    useEffect(() => {
        const handleClickOutsideInput = (event: any) => {
            // if the click is not within the results container or input, unfocus search
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                setIsFocused(false)
            } 
            
            // if the click is within the input ref retain focus
            if (inputRef.current && inputRef.current.contains(event.target)) { 
                setIsFocused(true);
            } 
        };

        // add listener for clicks
        document.addEventListener('click', handleClickOutsideInput);
        return () => document.removeEventListener('click', handleClickOutsideInput);

    });

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', width: '100%'}}>
            
            {/* search input */}
            <input type="search" ref={inputRef} onChange={(event) => fuzzySearchFilter(event.target.value)} value={currentText} onFocus={() => setIsFocused(true)} placeholder={placeholder} className={styles.searchInput} style={{backgroundColor: '#FFB788', caretColor: 'black', color: 'white'}} onKeyDown={handleKeyDown}/>
            
            {/* search results */}
            { isFocused && currentText && currentText.length > 0 && 
                <div className={styles.searchResultContainer} ref={resultsRef}>
                    { filteredResults.map((result, index) => {
                        // if selected item
                        if (index == 0) {
                            return <div key={index} className={styles.searchResultItem} onClick={() => listItemSelect(result)} style={{border: '2px solid #F94D00', display: 'flex', justifyContent: 'space-between'}}>
                                <p style={{color: 'black'}}>{result}</p>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 4V5.4C20 8.76031 20 10.4405 19.346 11.7239C18.7708 12.8529 17.8529 13.7708 16.7239 14.346C15.4405 15 13.7603 15 10.4 15H4M4 15L9 10M4 15L9 20" stroke="#F94D00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        } else { // if item is not selected
                            return <div key={index} className={styles.searchResultItem} onClick={() => listItemSelect(result)}>
                                <p style={{color: 'black'}}>{result}</p>
                            </div>
                        }
                    })}

                    {/* optional bottom link */}
                    { 
                        bottomSearchLink && 
                        bottomSearchText && 
                        <Link className={styles.bottomLink} href={bottomSearchLink}>{bottomSearchText}</Link>
                    }
                </div>
            }
        </div>
    );
}