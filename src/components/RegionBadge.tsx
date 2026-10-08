import React from 'react';
import { Backpack, Users } from 'lucide-react';
import { AudienceTag, Region } from '../types/travel';

interface RegionBadgeProps {
  audienceTag?: AudienceTag;
  region?: Region;
  size?: 'sm' | 'md' | 'lg';
  showRegionLabel?: boolean;
}

export const RegionBadge: React.FC<RegionBadgeProps> = ({
  audienceTag = 'Family & Elderly Friendly',
  region,
  size = 'md',
  showRegionLabel = false,
}) => {
  const isStudent = audienceTag === 'Student Friendly' || region === 'North Goa';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 min-h-[28px]',
    md: 'text-sm px-3.5 py-1.5 gap-2 min-h-[36px]',
    lg: 'text-base px-4 py-2 gap-2.5 min-h-[44px]',
  }[size];

  if (isStudent) {
    return (
      <span
        className={`inline-flex items-center font-bold rounded-full transition-all select-none ${sizeClasses}`}
        style={{
          backgroundColor: '#FFF1E8',
          border: '1.5px solid #FF8A3D',
          color: '#D05912',
        }}
        title="Student & Youth Friendly: Budget spots, scooter friendly, vibrant cafes & cliffs"
      >
        {/* Solid backpack icon on the left as specified */}
        <Backpack className="w-4 h-4 shrink-0 fill-[#D05912] stroke-[#D05912]" aria-hidden="true" />
        <span className="whitespace-nowrap">
          {showRegionLabel && region ? `${region} · ` : ''}Student Friendly
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full transition-all select-none ${sizeClasses}`}
      style={{
        backgroundColor: '#E6F6F5',
        border: '1.5px solid #0F9D94',
        color: '#096660',
      }}
      title="Family & Elderly Friendly: Calm waters, ramp access, shaded cabanas & gentle pace"
    >
      {/* Outlined family/accessibility icon on the left as specified */}
      <Users className="w-4 h-4 shrink-0 stroke-[#096660] stroke-[2]" aria-hidden="true" />
      <span className="whitespace-nowrap">
        {showRegionLabel && region ? `${region} · ` : ''}Family & Elderly Friendly
      </span>
    </span>
  );
};
