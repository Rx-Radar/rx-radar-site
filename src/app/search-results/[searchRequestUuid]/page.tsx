'use client';
 
import { useRouter, notFound } from 'next/navigation'; 
import { useEffect } from 'react';


export default function SearchResultPage({params}: {
  params: {
    searchRequestUuid: string;
  }
}) {
  if (params.searchRequestUuid !== 'test') {
    return notFound()
  }

  // useEffect(() => {
  //   if (params.searchRequestUuid !== 'test') {
  //     return notFound()
  //   }
  // })

  return (
    <div style={{backgroundColor: 'orange', width: '100%', height: '100%', padding: 20}}>
      <h1>RxRadar: Prescription search overview</h1>
      <div style={{backgroundColor: 'white', display: 'flex', flexDirection: 'column', padding: 16, borderRadius: 16, width: 'fit-content'}}>
        <p>Your search for</p>
      </div>
      <p>search_request_uuid: {params.searchRequestUuid}</p>
    </div>
  );
};

