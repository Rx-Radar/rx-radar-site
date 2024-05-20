// src/app/api/search-results/[searchRequestUuid]/route.ts

import { NextResponse } from 'next/server';
import { db } from "@/app/firebase-config";
import { collection, doc, getDoc } from 'firebase/firestore';


export async function GET(request: Request, { params }: { params: { searchRequestUuid: string } }) {
  const { searchRequestUuid } = params;

  // Fetch data from an external API or database based on the `searchRequestUuid`
  const searchResults = await fetchSearchResults(searchRequestUuid);

  return NextResponse.json(searchResults);
}


async function fetchSearchResults(searchRequestUuid: string) {
    try {
        // get search request doc
        const searchRequestDocRef = doc(collection(db, 'prod_search_requests'), searchRequestUuid);
        const searchRequestDocSnapshot = await getDoc(searchRequestDocRef);

        if (!searchRequestDocSnapshot.exists()) return null; // catch non-existent doc

        const searchRequest = searchRequestDocSnapshot.data()
        
        // get prescription and call details
        const prescription = searchRequest.prescription; 
        const userLat = 41.1415 //parseFloat(searchRequest.user_location.lat);
        const userLon = -73.3579 //parseFloat(searchRequest.user_location.lon);
        const calls = searchRequest.calls; 
        const searchTimestamp = formatEpochToDate(searchRequest.epoch_initiated);


        // get each calls doc data
        let callsList = [];
        for (const call_uuid of calls) {
            const callDocRef = doc(collection(db, 'prod_calls'), call_uuid);
            const callDocSnapshot = await getDoc(callDocRef);

            if (!callDocSnapshot.exists()) return null; // catch non-existent doc

            const call = callDocSnapshot.data();
            const result = call.result; // call resulted in "fillable", "unfillable", "inconclusive"

            if (result !== "fillable") continue; // skip this call because it did not result in "fillable"

            // create a new call and push it to calls_list
            const new_call = {
                result: result,
                notes: call.notes,
                pharmacy: await fetchPharmacy(call.pharmacy_uuid),
                transcript: await fetchCallTranscript(call.bland_call_id),
            }
            callsList.push(new_call)

        }
        return { prescription: prescription, calls: callsList, timestamp: searchTimestamp, userLat: userLat, userLon: userLon };

    } catch (error) {
        console.error('Error fetching search request:', error);
        return null;
    }
}

/**
 * fetch pharmacy data 
 * @param pharmacyUuid 
 */
async function fetchPharmacy(pharmacyUuid: string) {
    const pharmacyDocRef = doc(collection(db, 'prod_pharmacies'), pharmacyUuid);
    const pharmacyDocSnapshot = await getDoc(pharmacyDocRef);

    if (!pharmacyDocSnapshot.exists()) return null; // catch non-existent doc
    const pharmacy = pharmacyDocSnapshot.data();
    return {
        name: pharmacy.name,
        address: pharmacy.address,
        phone: pharmacy.phone,
        lon: pharmacy.location.lon,
        lat: pharmacy.location.lat,
        pharmCode: pharmacy.pharm_code,
    }
}

/**
 * fetches and formats call transcript from bland
 * @param blandCallId 
 * @returns 
 */
async function fetchCallTranscript(blandCallId: string) {
    const options = { 
        method: 'GET',
        headers: { authorization: 'sk-a8nctbcb5u3ko6jjwjlvs918uls8z3t2mp3ld6b004iqzcn51y7k7a1xj5rd12sf69' }
    };
    
    try {
    const response = await fetch(`https://api.bland.ai/v1/calls/${blandCallId}`, options);
    const responseData = await response.json();
    const transcripts = responseData.transcripts;
    const newTranscript = [];

    for (const transcript of transcripts) {
        if (transcript.user == "agent-action") continue; // skip any agent-actions in the transcript

        const speaker = transcript.user === "user" ? "Pharmacist" : "RxRadar";
        const addLine = {
            speaker: speaker,
            content: transcript.text
        };
        newTranscript.push(addLine);
    }

    return newTranscript;
    } catch (err) {
        console.error('Error fetching transcript:', err);
        return 'null';
    }
}

const formatEpochToDate = (epoch: number): string => {
    const date = new Date(epoch * 1000); // Multiply by 1000 to convert seconds to milliseconds
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
  
    return `${month}/${day}/${year}`;
  };