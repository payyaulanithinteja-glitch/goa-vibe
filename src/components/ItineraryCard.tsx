import React from 'react';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Bookmark,
  Lightbulb,
  Accessibility,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { ItineraryItem } from '../types/travel';
import { RegionBadge } from './RegionBadge';

interface ItineraryCardProps {
  item: ItineraryItem;
  onSelectOnMap?: (item: ItineraryItem) => void;
  onToggleBookmark?: (id: string) => void;
  onToggleCompleted?: (id: string) => void;
  onOpenMapsGrounding?: (item: ItineraryItem) => void;
  isActive?: boolean;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({
  item,
  onSelectOnMap,
  onToggleBookmark,
  onToggleCompleted,
  onOpenMapsGrounding,
  isActive = false,
}) => {
  return (
    <article
      className={`group relative bg-white rounded-2xl p-5 md:p-6 transition-all duration-200 border ${
        isActive
          ? 'border-[#0F9D94] shadow-tactile-2 ring-2 ring-[#0F9D94]/20'
          : 'border-[#5C6E6A]/15 shadow-tactile-1 hover:shadow-tactile-2 hover:border-[#5C6E6A]/30'
      }`}
      aria-label={`${item.time}: ${item.title}`}
    >
      {/* Top Row: Time Indicator (Large label-lg) & Category/Region Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#5C6E6A]/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F9D94]/10 text-[#0F9D94] font-extrabold text-lg tracking-tight">
            <Clock className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
            <span>{item.time}</span>
          </div>
          <span className="text-sm font-semibold text-[#5C6E6A]">{item.duration}</span>
        </div>

        <div className="flex items-center gap-2">
          <RegionBadge audienceTag={item.audienceTag} region={item.region} size="sm" />
          <button
            onClick={() => onToggleBookmark?.(item.id)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#5C6E6A] hover:text-[#FF8A3D] hover:bg-[#FFF1E8] transition-colors"
            title={item.isBookmarked ? 'Remove bookmark' : 'Bookmark this activity'}
            aria-label={item.isBookmarked ? 'Remove bookmark' : 'Bookmark activity'}
          >
            <Bookmark
              className={`w-5 h-5 ${
                item.isBookmarked
                  ? 'fill-[#FF8A3D] text-[#FF8A3D]'
                  : 'text-[#5C6E6A]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Title and Subtitle */}
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#243330] tracking-tight group-hover:text-[#0F9D94] transition-colors">
              {item.title}
            </h3>
            <p className="text-base font-semibold text-[#5C6E6A] mt-1">
              {item.subtitle}
            </p>
          </div>

          {/* Quick complete checkbox */}
          <button
            onClick={() => onToggleCompleted?.(item.id)}
            className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#E6F6F5] transition-colors"
            title={item.isCompleted ? 'Mark as pending' : 'Mark as visited'}
            aria-label={item.isCompleted ? 'Mark as pending' : 'Mark as visited'}
          >
            <CheckCircle2
              className={`w-6 h-6 transition-all ${
                item.isCompleted
                  ? 'fill-[#0F9D94] text-white'
                  : 'text-[#5C6E6A]/40 hover:text-[#0F9D94]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Address & Location Notes: Minimum 18px body text per design specification */}
      <div className="flex items-start gap-2.5 my-3 p-3 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8]/60">
        <MapPin className="w-5 h-5 text-[#0F9D94] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          {/* Minimum 18px text specification */}
          <p className="text-[18px] font-medium text-[#243330] leading-snug">
            {item.address}
          </p>
          <p className="text-sm text-[#5C6E6A] mt-0.5">
            {item.region} · Accessible via scooter or AC cab
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-base text-[#243330]/90 leading-relaxed my-3">
        {item.description}
      </p>

      {/* Multi-generational & Accessibility Perks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-sm">
        {item.seniorFriendly && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#E6F6F5] text-[#096660] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#0F9D94] shrink-0" />
            <span>Senior Friendly & Step-Free</span>
          </div>
        )}
        {item.studentDiscount && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FFF1E8] text-[#D05912] font-semibold">
            <Tag className="w-4 h-4 text-[#FF8A3D] shrink-0" />
            <span>Student Pass / ID Discount Available</span>
          </div>
        )}
      </div>

      {/* Accessibility Notes if available */}
      {item.accessibilityNotes && (
        <div className="flex items-start gap-2 text-sm text-[#5C6E6A] bg-white rounded-lg p-2.5 border border-[#5C6E6A]/15 my-2">
          <Accessibility className="w-4 h-4 text-[#0F9D94] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#243330]">Access Note:</strong> {item.accessibilityNotes}
          </span>
        </div>
      )}

      {/* Local Insider Tip: Sunkissed Callout */}
      {item.localTip && (
        <div className="mt-3 p-3.5 rounded-xl bg-[#FFF9F2] border-l-4 border-[#FF8A3D] text-sm text-[#243330]">
          <div className="flex items-center gap-1.5 font-bold text-[#D05912] mb-1">
            <Lightbulb className="w-4 h-4 text-[#FF8A3D]" />
            <span>Goan Local Tip</span>
          </div>
          <p className="leading-relaxed">{item.localTip}</p>
        </div>
      )}

      {/* Card Footer: Estimated Cost & View on Map CTA */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#5C6E6A]/10">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-semibold text-[#5C6E6A] uppercase tracking-wider">Est. Cost:</span>
          <span className="text-lg font-extrabold text-[#243330] font-mono tabular-nums">
            ₹{item.estimatedCost}
          </span>
          <span className="text-xs text-[#5C6E6A]">/ person</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMapsGrounding && (
            <button
              onClick={() => onOpenMapsGrounding(item)}
              className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold text-[#5C6E6A] bg-[#FFF9F2] hover:bg-[#E6F6F5] hover:text-[#0F9D94] border border-[#E6D8C8] transition-all flex items-center gap-1.5 cursor-pointer"
              title="View live Google Maps hours, parking & step-free access"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F9D94]" />
              <span className="hidden sm:inline">Maps Info</span>
            </button>
          )}

          <button
            onClick={() => onSelectOnMap?.(item)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-bold text-[#0F9D94] bg-[#E6F6F5] hover:bg-[#0F9D94] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>Pin on Map</span>
          </button>
        </div>
      </div>
    </article>
  );
};
