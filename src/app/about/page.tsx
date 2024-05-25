import { NavigationBar } from "../../../components/NavigationBar/NavigationBar"




export default function PricingPage() {
    return (
        <div className="w-full min-h-screen h-auto bg-[#eeeeee]">
            <NavigationBar/>

            <p className="text-3xl text-center mt-[5%]">who is rxradar</p>

            <div className="flex flex-col md:flex-row items-center mt-3 max-w-5xl mx-auto">

                <div className="bg-white flex m-5 mt-9 flex-col justify-start text-left p-5">
                    <p className="text-2xl font-bold">Simon</p>
                    <p className="text-xl">co-founder</p>

                    <p className="mt-3">
                        Access to a single search for a prescription of pharmacies in your area. 
                        Our proprietary service will select optimal pharmacies, call and speak with pharmacists, 
                        and send you a link with a detailed overview of each call.
                        You will also be able to review search results on a dynamic map.
                    </p>

                    <p className="mt-3 text-[#a1a0a0]">
                        *Note rxradar does not at this time guarantee that a prescription search will result in the successfully locating of a pharmacy that can fill your prescription.
                        Accuracy of rxradar's service may vary.
                    </p>
                </div>

                <div className="bg-white flex m-5 mt-9 flex-col justify-start text-left p-5">
                    <p className="text-2xl font-bold">Owen</p>
                    <p className="text-xl">co-founder</p>

                    <p className="mt-3">
                        Access to a single search for a prescription of pharmacies in your area. 
                        Our proprietary service will select optimal pharmacies, call and speak with pharmacists, 
                        and send you a link with a detailed overview of each call.
                        You will also be able to review search results on a dynamic map.
                    </p>

                    <p className="mt-3 text-[#a1a0a0]">
                        *Note rxradar does not at this time guarantee that a prescription search will result in the successfully locating of a pharmacy that can fill your prescription.
                        Accuracy of rxradar's service may vary.
                    </p>
                </div>
            </div>

        </div>
    );
}