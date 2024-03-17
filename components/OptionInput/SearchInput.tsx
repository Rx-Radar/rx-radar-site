import React, { useState, useRef } from 'react';
import styles from './SearchInput.module.css';
import Fuse from 'fuse.js';

const medications = ['Ritalin', 'Adderall', 'Dexedrine', 'Daytrana', 'Vyvanse'];

interface SearchInputProps {
    placeholder: string;
    searchResults?: string[]; // list of search results to display
    inputColor?: string;
    placeHolderColor?: string;
    backgroundColor?: string;
    caretColor?: string;
    type?: string;
  }

export const SearchInput:React.FC<SearchInputProps> = ({ searchResults, placeholder, inputColor, placeHolderColor, backgroundColor, caretColor, type}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false); // stores whether the user has focused the text input
    const [currentText, setCurrentText] = useState<string | undefined>(); // stores the current text the user is typing

    const [filteredResults, setFilteredResults] = useState<string[]>(medications); // medication parameter filtered list
    const [selectedItem, setSelectedItem] = useState<string>(filteredResults[0]); // current selected result parameter defaults to first element in list
    
    const inputRef = useRef<HTMLInputElement>(null); // reference to text input

    const options = {
        includeScore: true
    }

    const fuse = new Fuse(medications, options)

    // filters options on search
    const onTextTyped = (event: any) => {
        setCurrentText(event.target.value);
        const fuzzySearchResults = fuse.search(event.target.value).slice(0, 6);
        
        if (fuzzySearchResults.length > 0) {
            setFilteredResults(fuzzySearchResults.map(result => result.item));
            setSelectedItem(fuzzySearchResults[0].item);
        }
    }

    // on user press enter -> key select first item (bordered)
    const handleEnterKeyPressed = (event: any) => {
        if (event.key === 'Enter') {
            setCurrentText(selectedItem);
            setIsFocused(false);
            if (inputRef.current) inputRef.current.blur();
        }
    };

    // on user press enter key
    const listItemClicked = (item: string) => {
        // setCurrentText(item);
        // setIsFocused(false);
        // if (inputRef.current) inputRef.current.blur();
    };


    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', width: '100%'}}>
            {/* search input */}
            <input type={type} ref={inputRef} onChange={onTextTyped} value={currentText} onFocus={() => setIsFocused(true)} placeholder={placeholder} className={styles.searchInput} style={{backgroundColor: backgroundColor, caretColor: caretColor, color: inputColor}} onKeyDown={handleEnterKeyPressed}/>
            <div style={{width: 100, height: 100, backgroundColor: 'blue'}} onClick={() => console.log('this is happening')}></div>
            
            {/* search results */}
            { isFocused && currentText && currentText.length > 0 && 
                <div className={styles.searchResultContainer} onClick={() => {
                    console.log('waaaaahoooo -----------');
                    inputRef.current!.focus()}}>
                    { filteredResults.map((result, index) => {
                        // if item is selected
                        if (result == selectedItem) {
                            return <div key={index} className={styles.searchResultItem} onClick={() => listItemClicked(result)} style={{border: '2px solid #95bae8', display: 'flex', justifyContent: 'space-between'}}>
                                <p style={{color: 'black'}}>{result}</p>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 4V5.4C20 8.76031 20 10.4405 19.346 11.7239C18.7708 12.8529 17.8529 13.7708 16.7239 14.346C15.4405 15 13.7603 15 10.4 15H4M4 15L9 10M4 15L9 20" stroke="#95bae8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        } else { // if item is not selected
                            return <div key={index}  className={styles.searchResultItem} onClick={() => listItemClicked(result)}>
                                <p style={{color: 'black'}}>{result}</p>
                            </div>
                        }
                    })}
                </div>
            }
        </div>
    );
}