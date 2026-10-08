import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Sun,
  ShieldCheck,
  Waves,
  Eye,
  Info,
  Navigation,
  Sparkles,
  Users,
  Backpack
} from 'lucide-react';
import { BeachGuide, ItineraryItem } from '../types/travel';
import { INITIAL_BEACHES } from '../data/goaData';
import { RegionBadge } from './RegionBadge';
import { TactileButton } from './TactileButton';

interface CoastalMapProps {
  selectedBeach?: BeachGuide | null;
  onSelectBeach?: (beach: BeachGuide) => void;
  activeItem?: ItineraryItem | null;
  onOpenMapsGrounding?: (beach: BeachGuide) => void;
}

export const CoastalMap: React.FC<CoastalMapProps> = ({
  selectedBeach,
  onSelectBeach,
  activeItem,
  onOpenMapsGrounding,
}) => {
  const [filterRegion, setFilterRegion] = useState<'all' | 'North Goa' | 'South Goa' | 'accessible'>('all');
  const [internalSelected, setInternalSelected] = useState<BeachGuide>(selectedBeach || INITIAL_BEACHES[0]);

  const currentBeach = selectedBeach || internalSelected;

  const handleSelect = (beach: BeachGuide) => {
    setInternalSelected(beach);
    onSelectBeach?.(beach);
  };

  const filteredBeaches = INITIAL_BEACHES.filter((b) => {
    if (filterRegion === 'North Goa') return b.region === 'North Goa';
    if (filterRegion === 'South Goa') return b.region === 'South Goa' || b.region === 'Central Goa';
    if (filterRegion === 'accessible') return b.wheelchairAccess && b.elderlyRating >= 4;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#5C6E6A]/15 shadow-tactile-1 overflow-hidden">
      {/* Map Header & Filter Pills */}
      <div className="p-4 border-b border-[#5C6E6A]/10 bg-[#FFF9F2]/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#0F9D94] animate-spin-slow" />
            <h3 className="font-extrabold text-lg text-[#243330]">
              Goan Coast Navigator
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#0F9D94]/10 text-[#0F9D94] rounded-full">
            105 km Coastline
          </span>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterRegion('all')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterRegion === 'all'
                ? 'bg-[#243330] text-white shadow-sm'
                : 'bg-white text-[#5C6E6A] border border-[#5C6E6A]/20 hover:text-[#243330]'
            }`}
          >
            All Beaches
          </button>
          <button
            onClick={() => setFilterRegion('North Goa')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterRegion === 'North Goa'
                ? 'bg-[#FF8A3D] text-white shadow-sm'
                : 'bg-white text-[#D05912] border border-[#FF8A3D]/40 hover:bg-[#FFF1E8]'
            }`}
          >
            <Backpack className="w-3.5 h-3.5 fill-current" />
            North (Students)
          </button>
          <button
            onClick={() => setFilterRegion('South Goa')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterRegion === 'South Goa'
                ? 'bg-[#0F9D94] text-white shadow-sm'
                : 'bg-white text-[#096660] border border-[#0F9D94]/40 hover:bg-[#E6F6F5]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            South (Family / Senior)
          </button>
          <button
            onClick={() => setFilterRegion('accessible')}
            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterRegion === 'accessible'
                ? 'bg-[#006761] text-white shadow-sm'
                : 'bg-white text-[#5C6E6A] border border-[#5C6E6A]/20 hover:text-[#243330]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Step-Free Only
          </button>
        </div>
      </div>

      {/* Tactile Coastal SVG Map */}
      <div className="relative flex-1 min-h-[300px] md:min-h-[360px] bg-[#ecfdf8] overflow-hidden select-none border-b border-[#5C6E6A]/10">
        {/* Ocean Background & Wave Grid */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0F9D94_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Arabian Sea Label */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 tracking-widest text-xs font-extrabold text-[#006761] uppercase [writing-mode:vertical-lr]">
          Arabian Sea · West Coast
        </div>

        {/* Coastline Graphic Representation */}
        <svg
          viewBox="0 0 400 600"
          className="w-full h-full object-contain pointer-events-auto"
          aria-label="Interactive Map of Goa"
        >
          {/* Coastal Landmass Silhouette */}
          <path
            d="M 230 20 
               Q 200 60, 220 100 
               Q 180 140, 210 180 
               Q 230 210, 250 220 
               Q 270 250, 230 290 
               Q 190 330, 220 370 
               Q 240 410, 210 460 
               Q 180 500, 210 540 
               Q 230 570, 250 590 
               L 390 590 L 390 20 Z"
            fill="#FFF9F2"
            stroke="#E6D8C8"
            strokeWidth="3"
          />

          {/* Mandovi & Zuari River Estuaries */}
          <path
            d="M 215 240 Q 280 230, 390 240"
            fill="none"
            stroke="#ecfdf8"
            strokeWidth="8"
          />
          <path
            d="M 225 295 Q 290 290, 390 310"
            fill="none"
            stroke="#ecfdf8"
            strokeWidth="6"
          />

          {/* Region Divider Annotations */}
          <text x="310" y="110" fill="#D05912" fontSize="13" fontWeight="bold" opacity="0.8">
            NORTH GOA
          </text>
          <text x="310" y="270" fill="#0F9D94" fontSize="11" fontWeight="bold" opacity="0.8">
            CENTRAL / PANAJI
          </text>
          <text x="310" y="440" fill="#096660" fontSize="13" fontWeight="bold" opacity="0.8">
            SOUTH GOA
          </text>

          {/* Beach Pins */}
          {filteredBeaches.map((beach, index) => {
            // Geographic mapping coordinates to SVG viewBox
            const coordsMap: Record<string, { x: number; y: number }> = {
              'ashwem-morjim': { x: 195, y: 75 },
              'anjuna-vagator': { x: 185, y: 135 },
              'fontainhas-panaji': { x: 235, y: 245 },
              'benaulim-colva': { x: 200, y: 350 },
              'cavelossim-mobor': { x: 215, y: 430 },
              'palolem-beach': { x: 195, y: 520 },
            };

            const point = coordsMap[beach.id] || { x: 200, y: 100 + index * 60 };
            const isSelected = currentBeach.id === beach.id;
            const isNorth = beach.region === 'North Goa';

            return (
              <g
                key={beach.id}
                className="cursor-pointer group"
                onClick={() => handleSelect(beach)}
                tabIndex={0}
                role="button"
                aria-label={`Select ${beach.name}`}
              >
                {/* Pulse ring when selected */}
                {isSelected && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="20"
                    fill={isNorth ? '#FF8A3D' : '#0F9D94'}
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Outer pin ring */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? '14' : '10'}
                  fill={isSelected ? (isNorth ? '#FF8A3D' : '#0F9D94') : '#FFFFFF'}
                  stroke={isNorth ? '#FF8A3D' : '#0F9D94'}
                  strokeWidth={isSelected ? '3' : '2.5'}
                  className="transition-all duration-200 group-hover:scale-125"
                />

                {/* Inner dot */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? '5' : '3.5'}
                  fill={isSelected ? '#FFFFFF' : isNorth ? '#FF8A3D' : '#0F9D94'}
                />

                {/* Beach Label */}
                <text
                  x={point.x - 12}
                  y={point.y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#243330"
                  className="pointer-events-none drop-shadow-sm transition-all"
                >
                  {beach.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl border border-[#5C6E6A]/20 text-[11px] font-semibold text-[#243330] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF8A3D]" />
            <span>North (Student / Vibrant)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D94]" />
            <span>South (Family / Senior Friendly)</span>
          </div>
        </div>
      </div>

      {/* Selected Beach Details Drawer / Card */}
      {currentBeach && (
        <div className="p-4 md:p-5 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <RegionBadge
                  audienceTag={currentBeach.audienceTag}
                  region={currentBeach.region}
                  size="sm"
                />
                <span className="text-xs font-semibold text-[#5C6E6A]">
                  {currentBeach.region}
                </span>
              </div>
              <h4 className="text-xl font-extrabold text-[#243330]">
                {currentBeach.name}
              </h4>
              <p className="text-sm font-medium text-[#5C6E6A] mt-0.5">
                {currentBeach.vibe}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1 text-[#FF8A3D]">
                <Sun className="w-4 h-4 fill-[#FF8A3D]" />
                <span className="font-extrabold text-base font-mono tabular-nums">
                  {currentBeach.sunsetScore}/10
                </span>
              </div>
              <span className="text-[11px] text-[#5C6E6A]">Sunset Rating</span>
            </div>
          </div>

          <p className="text-sm text-[#243330] leading-relaxed my-3">
            {currentBeach.description}
          </p>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8]">
              <span className="text-[#5C6E6A] block font-semibold">Swimming Condition:</span>
              <span className="font-bold text-[#0F9D94] flex items-center gap-1 mt-0.5">
                <Waves className="w-3.5 h-3.5" />
                {currentBeach.swimmingSafety}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8]">
              <span className="text-[#5C6E6A] block font-semibold">Senior & Wheelchair:</span>
              <span className="font-bold text-[#096660] flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentBeach.elderlyRating}/5 Score · {currentBeach.wheelchairAccess ? 'Step-Free' : 'Steps'}
              </span>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-1 mb-4">
            <span className="text-xs font-bold text-[#5C6E6A] uppercase tracking-wide">
              Top Features:
            </span>
            <ul className="text-xs text-[#243330] space-y-1 pl-4 list-disc marker:text-[#0F9D94]">
              {currentBeach.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#5C6E6A]/10 gap-2">
            <div className="text-xs text-[#5C6E6A]">
              Shacks: <strong className="text-[#243330]">{currentBeach.shacksCount}+</strong> · {currentBeach.sunbedPrice}
            </div>
            <div className="flex items-center gap-2">
              {onOpenMapsGrounding && (
                <button
                  onClick={() => onOpenMapsGrounding(currentBeach)}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl border border-[#0F9D94] bg-[#E6F6F5] hover:bg-[#0F9D94] hover:text-white text-xs font-bold text-[#096660] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Live Google Maps details & parking"
                >
                  <Sparkles className="w-3.5 h-3.5 text-current" />
                  <span>Maps Info</span>
                </button>
              )}
              <TactileButton
                variant="outline"
                size="small"
                onClick={() => alert(`Directions loaded for ${currentBeach.name}! AC taxi rate from airport is approx ₹1,800 or scooter ₹350/day.`)}
                icon={<Navigation className="w-3.5 h-3.5" />}
              >
                Directions
              </TactileButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
