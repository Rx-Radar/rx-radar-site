import React, { useState, useRef, useEffect } from 'react';
import styles from './OptionInput.module.css';

// search input props
interface SearchInputProps {
    name?: string; // optional title for the input
    options: string[]; // list of search results to display
    style?: React.CSSProperties;
    onChange: (value: string) => void; // function called on option input changed
}

/**
 * SearchInput element allows for a filtered list
 * @param SearchInputProps 
 * @returns Searchable Input
 */
export const OptionInput:React.FC<SearchInputProps> = ({ options, style, name, onChange }) => {
    const [isFocused, setIsFocused] = useState<boolean>(false); // stores whether the user has focused the text input
    const [currentOption, setCurrentOption] = useState<string>(options[0]); // stores the current text the user is typing
    const [filteredResults, setFilteredResults] = useState<string[]>(options); // filtered list
    
    const inputRef = useRef<HTMLInputElement>(null); // input reference
    const resultsRef = useRef<HTMLDivElement>(null); // search results reference

    // updates onChange when current option changed
    useEffect(() => {
        onChange(currentOption);
    }, [currentOption]);

    // on list item select
    const listItemSelect = (item: string) => {
        setCurrentOption(item);
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
        <div style={{...style, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative',}}>
            
            {/* option selector */}
            <div onClick={() => setIsFocused(true)} className={styles.searchInput} style={{backgroundColor: '#FFB788', caretColor: 'black', color: 'white'}}>
                {name && <p style={{color: '#F94D00', fontSize: 12}}>{name}</p>}
                <p>{currentOption}</p>
            </div>
            
            {/* search results */}
            { isFocused && 
                <div className={styles.searchResultContainer} ref={resultsRef}>
                    { filteredResults.map((result, index) => {
                        const selectedStyle = { border: result == currentOption ? '2px solid #F94D00' : 'none' }

                        return <div key={index} className={styles.searchResultItem} style={selectedStyle} onClick={() => listItemSelect(result)}>
                            <p style={{color: 'black'}}>{result}</p>
                        </div>
                    })}
                </div>
            }
        </div>
    );
}