// src/app/search-results/[searchRequestUuid]/page.tsx

import { Metadata } from 'next';
import { NavigationBar } from '../../../../components/NavigationBar/NavigationBar';
import { Map } from '../../../../components/Map/Map';
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


  return (
    <div className="min-h-screen flex flex-col">

      {/* header */}
      {/* <div className="w-full bg-blue-500 p-5 text-white text-center fixed top-0 left-0 z-10">Box 1</div> */}
      <NavigationBar/>

      {/* main row */}
      <div className="flex flex-col-reverse justify-end flex-1 md:flex-row pt-16">

        {/* right side */}
        <div className="flex flex-col p-4 space-y-3 md:flex-1 md:h-[calc(100vh-4rem)]">

          
          
          {/* search result title */}
          <div className="">

            <p className="text-xl">Your search for <b className="text-[#F94D00]">{data.prescription.name}</b> on <b className="text-[#F94D00]">{data.timestamp}</b>:</p>

            <div className="p-2 bg-[#F2F3F4] text-[#F94D00] rounded-md mt-4">
              <p><b>Prescription</b> {data.prescription.name}</p>
              <p><b>Dosage</b> {data.prescription.dosage}</p>
              <p><b>Brand</b> {data.prescription.brand}</p>
              <p><b>Quantity</b> {data.prescription.quantity}</p>
              <p><b>Type</b> {data.prescription.type}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4 md:overflow-y-auto items-center">
            { data.calls.map((call: any, index: any) => {
              return <div key={index} className="bg-[#F9F9F9] border-2 border-[#F94D00] flex flex-col p-4 rounded-lg w-full mt-2">  

                <div className="flex flex-row justify-between items-center">
                  {/* pharmacy logo */}
                  <img
                    src="https://images.ctfassets.net/nu3qzhcv2o1c/3CyvJzxfGmux150UrFIN9e/fb472412561df30a688a0b897c998cc0/cvs-logo.svg"
                    alt="CVS Pharmacy Logo"
                    style={{ height: 'auto', padding: 5}}
                  />

                  {/* color fillable info depdning on status */}
                  { call.result == "fillable" ?
                    <p className="text-green-500 text-lg"><b>In Stock</b></p> :
                    <p className="text-red-500 text-lg"><b>Out/Uncertain</b></p>
                  }
                  
                </div>

                <p>{call.pharmacy.name}</p>
                <p>{call.pharmacy.address}</p>
                <p>{call.pharmacy.phone}</p>

                <div style={{backgroundColor: '#F4F0EC', borderRadius: 6, padding: 8, marginTop: 10, fontSize: 13}}>
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
          </div>
        </div>

        {/* left side */}
        <Map userLocation={{lat: data.userLat, lng: data.userLon}} pharmacies={data.calls}/>
      </div>
    </div>
  )

  // return (
  //   <div style={{backgroundColor: 'white', width: '100%', height: '100%', padding: 20}}>
  //     <NavigationBar/>
      
      // <div style={{backgroundColor: '#FBCEB1', border: '2px solid #F94E02', display: 'flex', flexDirection: 'column', padding: 16, borderRadius: 16, width: '80%', marginTop: 50}}>
      //   <div style={{display: 'flex', fontSize: 18, flexDirection: 'row', width: 'fit-content'}}>
      //     <p>Your search for <b>{data.prescription.name}</b> on <b>{data.timestamp}</b>:</p>
      //   </div>

      //   <div style={{marginTop: 20, padding: 10, fontSize: 15}}>
      //     <p style={{paddingBottom:5, fontSize: 18, fontWeight: '800'}}>Prescription details:</p>
      //     <p><b>Prescription</b> {data.prescription.name}</p>
      //     <p><b>Dosage</b> {data.prescription.dosage}</p>
      //     <p><b>Brand</b> {data.prescription.brand}</p>
      //     <p><b>Quantity</b> {data.prescription.quantity}</p>
      //     <p><b>Type</b> {data.prescription.type}</p>
      //   </div>

      // </div>

  //     <p style={{marginTop: 15, marginBottom: 10, fontWeight: '700', fontSize: 25}}>Pharmacies that have your prescription available</p>

      // { data.calls.map((call: any) => {
      //   return <div style={{backgroundColor: '#ACE1AF', border: '2px solid #8DB600', display: 'flex', flexDirection: 'column', padding: 16, borderRadius: 16, width: '80%', marginTop: 8}}>
          
      //     <p style={{marginBottom: 5, padding: 8, backgroundColor: '#8DB600', borderRadius: 6, width: 'fit-content'}}><b>In Stock!</b></p>

      //     <p><b>Pharmacy</b> {call.pharmacy.name}</p>
      //     <p><b>Pharmacy Address</b> {call.pharmacy.address}</p>
      //     <p><b>Phone Number</b> {call.pharmacy.phone}</p>

      //     <div style={{backgroundColor: '#8DB600', borderRadius: 6, padding: 8, marginTop: 10}}>
      //       <p style={{marginBottom: 5}}><b>Transcript</b></p>
      //       { call.transcript.map((line: any) => {
      //         return <div style={{display: 'flex'}}>
      //             <p><b>{line.speaker}</b>: {line.content}</p>
      //           </div>
      //         })
      //       }
      //     </div>
      //   </div>
      // })
      // }

  //     {/* use the below for debugging server response data */}
  //     {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
  //   </div>
  // );
}

