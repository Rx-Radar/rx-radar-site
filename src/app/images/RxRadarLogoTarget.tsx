import React from 'react';

interface RxRadarLogoTargetProps {
    size: number;
}

const RxRadarLogoTarget: React.FC<RxRadarLogoTargetProps> = ({size}) => {
    //628
    return (
        <svg width={size} height={size} viewBox="0 0 628 628" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="314" cy="314" r="302" fill="#FBCEB1" stroke="#F94D00" stroke-width="24"/>
            <circle cx="314" cy="314" r="189.857" fill="#FBCEB1" stroke="#F94D00" stroke-width="24"/>
            <circle cx="314" cy="314" r="67.2857" fill="#F94D00"/>
        </svg>
    );
}

export default RxRadarLogoTarget;