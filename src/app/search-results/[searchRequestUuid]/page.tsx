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
    <div style={{backgroundColor: 'white', width: '100%', height: '100%', padding: 20}}>
      <h1>RxRadar: Prescription search overview</h1>
      <div style={{backgroundColor: '#FBCEB1', border: '2px solid #F94E02', display: 'flex', flexDirection: 'column', padding: 16, borderRadius: 16, width: '80%'}}>
      
        <p style={{fontSize: 18, width: 'fit-content'}}>Your search for <p style={{fontWeight: '700'}}>Focalin</p> on <p style={{fontWeight: '700'}}>3/18/24</p>:</p>
        <p>Focalin</p>
        <p>10mg</p>
        <p>extended release</p>
        <p>Focalin</p>
      </div>
      <p>search_request_uuid: {params.searchRequestUuid}</p>
    </div>
  );
};

