import { NavigationBar } from "../../../components/NavigationBar/NavigationBar"




export default function PricingPage() {
    return (
        <div className="w-full h-full bg-[#eeeeee]">
            <NavigationBar/>

            <div className="flex flex-col items-center mt-[5%] max-w-2xl mx-auto">
                <p className="text-3xl text-center md:text-left">pricing made for real people</p>

                <div className="bg-white flex m-5 mt-9 flex-col justify-start text-center md:text-left p-5">
                    <p className="text-3xl font-bold">One Time</p>
                    <p className="text-2xl">$5 charge</p>

                    <p className="mt-3">
                        Access to a single search for a prescription of pharmacies in your area. 
                        Our proprietary service will select optimal pharmacies, call and speak with pharmacists, 
                        and send you a link with a detailed overview of each call.
                        You will also be able to review search results on a dynamic map.
                    </p>

                    <p className="mt-3 text-[#a1a0a0]">
                        *Note while rxradar strives to yield in-stock pharmacies for each search, we cannot guarantee succesful outcomes, and under most circumstances will not issue refunds.
                        Additionally, the accuracy of rxradar's service may vary.
                    </p>
                </div>
            </div>

        </div>
    );
}