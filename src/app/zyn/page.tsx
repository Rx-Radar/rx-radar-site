import Link from 'next/link';
import { ZynMapComponent } from './ZynMap';

export default async function ZynRadar() {
  // const res = await fetch(`http://localhost:3000/api/zyn-get-store`, { cache: 'no-store' }); // dev
  const res = await fetch(`http://rx-radar.com/api/zyn-get-store`, { cache: 'no-store' }); // production
  const data = await res.json();

  return <div className="absolute top-0 left-0 right-0 bottom-0">

      {/* header bar */}
      <div className="w-full, p-2 bg-[#f9f4f4] flex flex-column md:flex-row justify-between">
        <img
        style={{width: 254, height: 53}}
        src="/zynlogo.png"
        alt="Zyn Radar"
        className="object-cover w-full h-full filter"
        /> 

        <Link href="/" className="px-6 py-3 bg-transparent border border-[#F94D00] rounded-full text-[#F94D00] font-semibold hover:bg-black hover:border-black hover:text-white transition duration-300 mx-auto sm:mx-0">
        Cant find your ADHD meds?
        </Link>
      </div>

      {/* map */}
      <ZynMapComponent stores={data.stores}/>
  </div>
};

export type Store = {
    name: string; 
    lat: number;
    lon: number;
    address: string;
    phone: string;
    availability: string;
};


