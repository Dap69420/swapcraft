import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = 'rgba(255, 255, 255, 0.45)',
      shimmerSize = '0.08em',
      shimmerDuration = '2.5s',
      borderRadius = '9999px',
      background = 'var(--theme-primary)',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as React.CSSProperties
        }
        className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 font-semibold text-white [background:var(--bg)] [border-radius:var(--radius)] shadow-xs transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
        {...props}
      >
        {/* Spark container */}
        <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
          {/* Spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* Spark before */}
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {/* Highlight / glow overlay */}
        <div className="absolute inset-px -z-10 rounded-[inherit] bg-[inherit] opacity-90 group-hover:opacity-100 transition-opacity" />
        {children}
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
