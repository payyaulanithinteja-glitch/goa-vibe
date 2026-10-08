import React from 'react';

export interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'large' | 'small';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  // Height & Touch Target specification: minimum 48px, large 56px
  const sizeClasses = {
    small: 'min-h-[44px] px-4 py-2 text-sm',
    default: 'min-h-[48px] px-5 py-2.5 text-base',
    large: 'min-h-[56px] px-6 py-3.5 text-lg',
  }[size];

  let variantStyles = '';

  if (variant === 'primary') {
    // Primary Action (Teal): Solid #0F9D94 fill, white #FFFFFF text, 12px rounded corners. Subtly lifts on press.
    variantStyles =
      'bg-[#0F9D94] text-white hover:bg-[#0c857e] active:translate-y-0.5 shadow-[0px_4px_14px_rgba(15,157,148,0.28)] focus-visible:ring-4 focus-visible:ring-[#0F9D94]/30';
  } else if (variant === 'secondary') {
    // Secondary Accent (Orange): Solid #FF8A3D fill, white #FFFFFF text.
    variantStyles =
      'bg-[#FF8A3D] text-white hover:bg-[#f07b2f] active:translate-y-0.5 shadow-[0px_4px_14px_rgba(255,138,61,0.28)] focus-visible:ring-4 focus-visible:ring-[#FF8A3D]/30';
  } else if (variant === 'outline') {
    // Outline / Low Emphasis: Pure white background, 1.5px border in #5C6E6A at 30% opacity, #243330 text.
    variantStyles =
      'bg-white text-[#243330] border-[1.5px] border-[#5C6E6A]/30 hover:border-[#5C6E6A]/60 hover:bg-[#FFF9F2] active:translate-y-0.5 focus-visible:ring-4 focus-visible:ring-[#5C6E6A]/20';
  } else if (variant === 'ghost') {
    variantStyles =
      'bg-transparent text-[#243330] hover:bg-[#0F9D94]/10 active:translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#0F9D94]';
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2.5 font-bold rounded-xl transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${sizeClasses} ${variantStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap tracking-wide">{children}</span>
    </button>
  );
};
