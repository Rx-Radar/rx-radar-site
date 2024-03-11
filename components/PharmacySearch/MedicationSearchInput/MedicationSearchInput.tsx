import { useState } from 'react';
import styles from './MedicationSearchInput.module.css';
import Fuse from 'fuse.js';

const medications = ['Ritalin', 'Adderall', 'Dexedrine', 'Daytrana', 'Vyvanse'];
const dosage = ['40mg', '60mg', '120mg', '200mg'];
const type = ['generic', 'namebrand', 'either'];


export const MedicationSearchInput = () => {
    const [isFocused, setIsFocused] = useState<boolean>(false); // stores whether the user has focused the text input
    const [currentText, setCurrentText] = useState<string | undefined>(); // stores the current text the user is typing

    const [filteredResults, setFilteredResults] = useState<string[]>(medications); // medication parameter filtered list
    const [selectedItem, setSelectedItem] = useState<string>(filteredResults[0]); // current selected result parameter

    const options = {
        includeScore: true
    }

    const fuse = new Fuse(medications, options)

    // on user type text
    const onTextTyped= (event: any) => {
        setCurrentText(event.target.value);
        const fuzzySearchResults = fuse.search(event.target.value).slice(0, 6);
        
        if (fuzzySearchResults.length > 0) {
            setFilteredResults(fuzzySearchResults.map(result => result.item));
            setSelectedItem(fuzzySearchResults[0].item);
        }
    }

    // on user press enter key
    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            setCurrentText(selectedItem);
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative',}}>
            {/* search input */}
            <input onChange={onTextTyped} value={currentText} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} type="text" placeholder="Search for medication..." className={styles.searchInput} onKeyDown={handleKeyDown}/>
            
            {/* search results */}
            { isFocused && currentText && currentText.length > 0 && 
                <div className={styles.searchResultContainer}>
                    { filteredResults.map((result, index) => {
                        // if item is selected
                        if (result == selectedItem) {
                            return <div className={styles.searchResultItem} style={{border: '2px solid #95bae8', display: 'flex', justifyContent: 'space-between'}}>
                                <p key={index} style={{color: 'black'}}>{result}</p>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 4V5.4C20 8.76031 20 10.4405 19.346 11.7239C18.7708 12.8529 17.8529 13.7708 16.7239 14.346C15.4405 15 13.7603 15 10.4 15H4M4 15L9 10M4 15L9 20" stroke="#95bae8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        } else { // if item is not selected
                            return <div className={styles.searchResultItem}>
                                <p key={index} style={{color: 'black'}}>{result}</p>
                            </div>
                        }
                    })}
                </div>
            }
        </div>
    );
}