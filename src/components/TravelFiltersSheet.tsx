import { X, SlidersHorizontal, ShieldCheck, Tag, Accessibility, Check } from 'lucide-react';
import { TravelFilters } from '../types/travel';
import { TactileButton } from './TactileButton';

interface TravelFiltersSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TravelFilters;
  onChangeFilters: (filters: TravelFilters) => void;
  onReset: () => void;
}

export const TravelFiltersSheet: React.FC<TravelFiltersSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#243330]/40 backdrop-blur-md animate-fade-in p-0 sm:p-4">
      {/* Level 3 elevation container */}
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-tactile-3 border border-[#5C6E6A]/20 overflow-hidden max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Travel Filters"
      >
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#5C6E6A]/30 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#5C6E6A]/10 bg-[#FFF9F2]">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-[#0F9D94]" />
            <h3 className="font-extrabold text-xl text-[#243330]">
              Travel & Accessibility Filters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5C6E6A] hover:bg-black/5 cursor-pointer"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Region selector */}
          <div>
            <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2.5">
              Target Coastline
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['All', 'North Goa', 'South Goa'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => onChangeFilters({ ...filters, region: r })}
                  className={`min-h-[48px] rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    filters.region === r
                      ? 'bg-[#0F9D94] text-white shadow-sm'
                      : 'bg-[#FFF9F2] text-[#243330] border border-[#E6D8C8] hover:border-[#0F9D94]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Audience */}
          <div>
            <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2.5">
              Audience Category
            </label>
            <div className="flex flex-col gap-2">
              {[
                { id: 'All', title: 'All Experiences & Travelers' },
                { id: 'Family & Elderly Friendly', title: 'Family & Elderly Friendly (Calm & Step-Free)' },
                { id: 'Student Friendly', title: 'Student Friendly (Youth, Budget & Nightlife)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeFilters({ ...filters, audience: opt.id as any })}
                  className={`min-h-[48px] p-3 text-left rounded-xl font-bold text-sm transition-all flex items-center justify-between cursor-pointer border ${
                    filters.audience === opt.id
                      ? 'border-[#0F9D94] bg-[#E6F6F5] text-[#096660]'
                      : 'border-[#5C6E6A]/20 bg-white text-[#243330] hover:bg-[#FFF9F2]'
                  }`}
                >
                  <span>{opt.title}</span>
                  {filters.audience === opt.id && <Check className="w-4 h-4 text-[#0F9D94]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Requirements */}
          <div>
            <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2.5">
              Accessibility & Perks
            </label>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#5C6E6A]/20 hover:bg-[#FFF9F2] cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={filters.seniorFriendlyOnly}
                  onChange={(e) =>
                    onChangeFilters({ ...filters, seniorFriendlyOnly: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#0F9D94] rounded cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm font-bold text-[#243330]">
                  <ShieldCheck className="w-4 h-4 text-[#0F9D94]" />
                  <span>Senior Friendly & Step-Free Resting Stops</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#5C6E6A]/20 hover:bg-[#FFF9F2] cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={filters.wheelchairAccessOnly}
                  onChange={(e) =>
                    onChangeFilters({ ...filters, wheelchairAccessOnly: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#0F9D94] rounded cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm font-bold text-[#243330]">
                  <Accessibility className="w-4 h-4 text-[#0F9D94]" />
                  <span>Wheelchair Ramp & Paved Paths</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#5C6E6A]/20 hover:bg-[#FFF9F2] cursor-pointer min-h-[48px]">
                <input
                  type="checkbox"
                  checked={filters.studentDiscountOnly}
                  onChange={(e) =>
                    onChangeFilters({ ...filters, studentDiscountOnly: e.target.checked })
                  }
                  className="w-5 h-5 accent-[#FF8A3D] rounded cursor-pointer"
                />
                <div className="flex items-center gap-2 text-sm font-bold text-[#243330]">
                  <Tag className="w-4 h-4 text-[#FF8A3D]" />
                  <span>Student ID Discounts & Budget Passes</span>
                </div>
              </label>
            </div>
          </div>

          {/* Max Cost Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider">
                Max Activity Cost
              </span>
              <span className="font-extrabold text-sm text-[#243330] font-mono tabular-nums">
                ₹{filters.maxCost} / person
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="100"
              value={filters.maxCost}
              onChange={(e) =>
                onChangeFilters({ ...filters, maxCost: Number(e.target.value) })
              }
              className="w-full accent-[#0F9D94] h-2 bg-[#E6D8C8] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#5C6E6A] mt-1 font-semibold">
              <span>₹200 (Budget)</span>
              <span>₹800 (Moderate)</span>
              <span>₹1,500+ (Premium)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#5C6E6A]/10 bg-[#FFF9F2] flex items-center justify-between gap-3">
          <button
            onClick={onReset}
            className="text-sm font-bold text-[#5C6E6A] hover:text-[#243330] cursor-pointer"
          >
            Reset All
          </button>
          <TactileButton variant="primary" size="default" onClick={onClose}>
            Apply Filters
          </TactileButton>
        </div>
      </div>
    </div>
  );
};
