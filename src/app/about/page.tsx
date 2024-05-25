import { NavigationBar } from "../../../components/NavigationBar/NavigationBar"




export default function PricingPage() {
    return (
        <div className="w-full min-h-screen h-auto bg-[#eeeeee]">
            <NavigationBar/>

            <p className="text-3xl text-center mt-[5%]">who is rxradar</p>

            <div className="flex flex-col md:flex-row items-center mt-3 max-w-5xl mx-auto">

                <div className="bg-white flex m-5 mt-9 flex-col justify-start text-left p-5">
                    <img
                    style={{width: 80, height: 80}}
                    src="/simonheadshot.png"
                    alt="Boston Map"
                    className="object-cover w-full h-full filter"
                    />
                    <p className="text-2xl font-bold pt-4">Simon</p>
                    <p className="text-xl">co-founder</p>

                    <p className="mt-3">
                        Simon's expirience trying to fill his in-shortage prescriptions first hand was the driving inspiration
                        for what's become rxradar today. He knew there must be a better alternative to the monthly laborous task of calling 
                        tens of pharmacies looking to access his medications. Orignally from CT, Simon has worked in both NYC and CA and enjoys
                        working to solve real problems he's passionate about in his free time. 
                    </p>
                </div>

                <div className="bg-white flex m-5 mt-9 flex-col justify-start text-left p-5">
                    <img
                    style={{width: 80, height: 80}}
                    src="/owenheadshot.png"
                    alt="Boston Map"
                    className="object-cover w-full h-full filter"
                    />
                    <p className="text-2xl font-bold pt-4">Owen</p>
                    <p className="text-xl">co-founder</p>

                    <p className="mt-3">
                        Owen's love for making software that helps people is what brought Owen and Simon together 
                        7 years ago to work on a school project. Owen realized the profound impact of what
                        rxradar could become and got right to work. Owen enjoys music, sailing, and running in his free time.
                    </p>
                </div>
            </div>

        </div>
    );
}