import PulseLoader from "../LoaderAnimations/PulseLoader/PulseLoader";
import QuantumLoader from "../LoaderAnimations/QuantumLoader/QuantumLoader";



// loading screen
export const LoadingScreen = () => {
    return (
      <div className="fixed inset-0 z-9999 flex items-end pb-[10%] justify-center bg-black bg-opacity-50">
        <PulseLoader />
      </div>
    );
  };