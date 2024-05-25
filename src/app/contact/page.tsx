import Footer from "../../../components/Footer/Footer";
import { NavigationBar } from "../../../components/NavigationBar/NavigationBar"




export default function PricingPage() {
    return (
        <div className="w-full h-full bg-[#eeeeee]">
            <NavigationBar/>

            <div className="flex flex-col items-center mt-[5%] max-w-2xl mx-auto">
                <p className="text-3xl text-center md:text-left">contact us</p>

                <div className="flex m-5 mt-9 flex-col justify-start text-center md:text-left p-5">
                    <p className="text-xl">want to reach us regarding questions, general inquires?</p>
                    <p className="text-md font-bold mt-2">rxradarcontact@gmail.com</p>

                    <p className="text-xl mt-6">imediate concerns or problem with your search?</p>
                    <p className="text-md font-bold mt-2">Text To: (203) 767 4296</p>
                    
                </div>
            </div>
        </div>
    );
}