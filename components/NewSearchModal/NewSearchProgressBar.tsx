import React from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import { SearchStep } from "./NewSearchModal";

interface MultiStepProgressBarProps {
  step: SearchStep;
}

const MultiStepProgressBar: React.FC<MultiStepProgressBarProps> = ({ step }) => {
  
  const getStepPercentage = () => {
    console.log('yoo')
    switch (step) {
      case SearchStep.One:
        return 25;
      case SearchStep.Two:
        return 75;
      case SearchStep.Three:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <ProgressBar
    percent={getStepPercentage()}
    filledBackground="black"
    height={'2px'}
    className="w-3/4 mx-auto rounded-full bg-gray-300 my-5 h-28"
    >
      {[SearchStep.One, SearchStep.Two, SearchStep.Three].map((step, index) => (
        <Step key={index}>
          {({ accomplished }: { accomplished: boolean }) => (
            <div
              className={`${
                accomplished ? "bg-black text-white border-none" : "bg-white text-gray-700 border"
              } w-10 h-10 text-xs rounded-full flex justify-center items-center cursor-pointer`}
            >
              {index + 1}
            </div>
          )}
        </Step>
      ))}
    </ProgressBar>
  );
};

export default MultiStepProgressBar;
