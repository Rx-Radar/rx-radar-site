// src/app/search-results/[searchRequestUuid]/page.tsx

import { Metadata } from 'next';
import { NavigationBar } from '../../../../components/NavigationBar/NavigationBar';
import { notFound } from 'next/navigation'; 


interface PageProps {
  params: {
    searchRequestUuid: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // You can generate dynamic metadata based on the `searchRequestUuid`
  return {
    title: `Search Results for ${params.searchRequestUuid}`,
  };
}

export default async function Page({ params }: PageProps) {
  const { searchRequestUuid } = params;

  // Fetch data from the API using the `searchRequestUuid`
  // const res = await fetch(`http://localhost:3000/api/search-results/${searchRequestUuid}`, { cache: 'no-store' }); // <------------ USE FOR LOCAL TESTING
  const res = await fetch(`http://rx-radar.com/api/search-results/${searchRequestUuid}`, { cache: 'no-store' });
  const data = await res.json();

  if (!data) return notFound(); // return 404 if invalid searchRequestUuid 

  console.log(data.prescription);

  return (
    <div style={{backgroundColor: 'white', width: '100%', height: '100%', padding: 20}}>
      <NavigationBar/>
      
      <div style={{backgroundColor: '#FBCEB1', border: '2px solid #F94E02', display: 'flex', flexDirection: 'column', padding: 16, borderRadius: 16, width: '80%', marginTop: 50}}>
        <div style={{display: 'flex', fontSize: 18, flexDirection: 'row', width: 'fit-content'}}>
          <p>Your search for <b>{data.prescription.name}</b> on <b>{data.timestamp}</b>:</p>
        </div>

        <div style={{marginTop: 20, padding: 10, fontSize: 15}}>
          <p style={{paddingBottom:5, fontSize: 18, fontWeight: '800'}}>Prescription details:</p>
          <p><b>Prescription</b> {data.prescription.name}</p>
          <p><b>Dosage</b> {data.prescription.dosage}</p>
          <p><b>Brand</b> {data.prescription.brand}</p>
          <p><b>Quantity</b> {data.prescription.quantity}</p>
          <p><b>Type</b> {data.prescription.type}</p>
        </div>

      </div>

      <p style={{marginTop: 15, marginBottom: 10, fontWeight: '700', fontSize: 25}}>Pharmacies that have your prescription available</p>

      { data.calls.map((call: any) => {
        return <div style={{backgroundColor: '#ACE1AF', border: '2px solid #8DB600', display: 'flex', flexDirection: 'column', padding: 16, borderRadius: 16, width: '80%', marginTop: 8}}>
          
          <p style={{marginBottom: 5, padding: 8, backgroundColor: '#8DB600', borderRadius: 6, width: 'fit-content'}}><b>In Stock!</b></p>

          <p><b>Pharmacy</b> {call.pharmacy.name}</p>
          <p><b>Pharmacy Address</b> {call.pharmacy.address}</p>
          <p><b>Phone Number</b> {call.pharmacy.phone}</p>

          <div style={{backgroundColor: '#8DB600', borderRadius: 6, padding: 8, marginTop: 10}}>
            <p style={{marginBottom: 5}}><b>Transcript</b></p>
            { call.transcript.map((line: any) => {
              return <div style={{display: 'flex'}}>
                  <p><b>{line.speaker}</b>: {line.content}</p>
                </div>
              })
            }
          </div>
        </div>
      })
      }

      {/* use the below for debugging server response data */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

