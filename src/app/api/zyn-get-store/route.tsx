// src/app/api/zyn-get-store/route.ts

import { NextResponse } from 'next/server';
import { db } from "@/app/firebase-config";
import { collection, getDocs } from "firebase/firestore";


export async function GET(request: Request) {

  // Fetch data from an external API or database based on the `searchRequestUuid`
  const searchResults = await fetchSearchResults();
  return NextResponse.json(searchResults);
}

async function fetchSearchResults() {
    try {
        const collectionRef = collection(db, 'zyn_stores');
        const snapshot = await getDocs(collectionRef);

        if (snapshot.empty) {
            return { stores: [] }
        }

        const stores = snapshot.docs.map(doc => {
            const store = doc.data()
            return {
                name: store['Name'],
                lat: store['Latitude'],
                lon: store['Longitude'],
                address: store['Address1'],
                phone: store['Phone'],
                availability: store['Availability']
            }
        });

        console.log('zyn map fetched search results');
        return { stores: stores }

    } catch (error) {
        console.error('Error fetching search request:', error);
        return null
    }
}