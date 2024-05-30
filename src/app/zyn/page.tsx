import Link from 'next/link';
import { ZynMapComponent } from './ZynMap';

export default async function ZynRadar() {
  //const res = await fetch(`http://localhost:3000/api/zyn-get-store`, { cache: 'no-store' }); // dev
  const res = await fetch(`http://rx-radar.com/api/zyn-get-store`, { cache: 'no-store' }); // production
  const data = await res.json();

  return <div className="flex flex-col h-screen overflow-hidden">
    <Link href="/" className=" w-full py-1 bg-[#F94D00] text-white text-sm font-semibol flex justify-center">
      Can't find your ADHD meds? Click here
    </Link>

    {/* header bar */}
    <div className="w-full, p-2 bg-[#f9f4f4] flex flex-wrap justify-between items-center">
      {/* <img
      style={{width: 150, height: 31}}
      src="/zynlogo.png"
      alt="Zyn Radar"
      className="object-cover w-full h-full filter"
      />  */}
      <p className="text-2xl font-bold ml-1">FindZyn.com</p>
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


