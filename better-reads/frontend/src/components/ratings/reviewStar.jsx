import React from 'react';

const ReviewStar = ({ fillLevel = 0 }) => {
  const filledColor = '#F1E132'; // Yellow for filled
  const emptyColor = '#C6C6C6';   // Gray for unfilled
  
  const gradientId = `gradient-${React.useId()}`;
  const innerShadowFilterId = `inner-shadow-${React.useId()}`;

  // Clamp fillLevel between 0 and 1, then convert to percentage string
  const fillPercentage = `${Math.max(0, Math.min(1, fillLevel)) * 100}%`;

  // Standard 5-point star SVG path (from Material Icons)
  const starPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z";

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0%" stopColor={filledColor} />
          <stop offset={fillPercentage} stopColor={filledColor} />
          <stop offset={fillPercentage} stopColor={emptyColor} />
          <stop offset="100%" stopColor={emptyColor} />
        </linearGradient>
        <filter id={innerShadowFilterId} x="-50%" y="-50%" width="200%" height="200%">
          {/* Shadow color and opacity */}
          <feFlood floodColor="#855949" floodOpacity="0.25" result="shadowColor"/>
          {/* Create a mask by cutting out SourceAlpha from the shadowColor plane */}
          <feComposite in="shadowColor" in2="SourceAlpha" operator="out" result="cutoutMask"/>
          {/* Blur the cutout mask */}
          <feGaussianBlur in="cutoutMask" stdDeviation="1" result="blurredCutoutMask"/>
          {/* Place the blurred mask inside the original SourceAlpha */}
          <feComposite in="blurredCutoutMask" in2="SourceAlpha" operator="in" result="innerShadowEffect"/>
          {/* Offset the inner shadow */}
          <feOffset dx="0" dy="1" in="innerShadowEffect" result="offsetInnerShadow"/>
          {/* Merge the shadow and the original graphic */}
          <feMerge>
            <feMergeNode in="SourceGraphic"/>
            <feMergeNode in="offsetInnerShadow"/>
          </feMerge>
        </filter>
      </defs>
      <path 
        d={starPath} 
        fill={`url(#${gradientId})`} 
        filter={`url(#${innerShadowFilterId})`}
      />
    </svg>
  );
};

export default ReviewStar;
