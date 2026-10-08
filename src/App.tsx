import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Compass,
  Sparkles,
  ShieldCheck,
  Wallet,
  SlidersHorizontal,
  Smartphone,
  Monitor,
  Sun,
  MapPin,
  CheckCircle,
  Plus,
  ArrowRight,
  Bookmark,
  Share2,
  RefreshCw,
  Waves,
  Search,
  Filter,
  Mic
} from 'lucide-react';
import {
  DaySchedule,
  ItineraryItem,
  BeachGuide,
  TravelFilters
} from './types/travel';
import { INITIAL_SCHEDULES, INITIAL_BEACHES } from './data/goaData';
import { ItineraryCard } from './components/ItineraryCard';
import { CoastalMap } from './components/CoastalMap';
import { RegionBadge } from './components/RegionBadge';
import { TactileButton } from './components/TactileButton';
import { AIPlannerModal } from './components/AIPlannerModal';
import { TravelFiltersSheet } from './components/TravelFiltersSheet';
import { LocalGuide } from './components/LocalGuide';
import { BudgetCalculator } from './components/BudgetCalculator';
import { WeatherForecastCallout } from './components/WeatherForecastCallout';
import { MapsGroundingModal } from './components/MapsGroundingModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'itinerary' | 'map' | 'planner' | 'guide' | 'budget'
  >('itinerary');

  // Viewport mode: Responsive Desktop vs Phone Frame Simulation
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // Schedules state
  const [schedules, setSchedules] = useState<DaySchedule[]>(INITIAL_SCHEDULES);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  // Active beach or map selection
  const [selectedBeach, setSelectedBeach] = useState<BeachGuide | null>(INITIAL_BEACHES[0]);
  const [activeItemForMap, setActiveItemForMap] = useState<ItineraryItem | null>(null);

  // Modals & Sheets
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [mapsGroundingTarget, setMapsGroundingTarget] = useState<{
    placeName: string;
    address?: string;
    region?: string;
  } | null>(null);

  // Search query & filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<TravelFilters>({
    region: 'All',
    audience: 'All',
    seniorFriendlyOnly: false,
    wheelchairAccessOnly: false,
    studentDiscountOnly: false,
    maxCost: 1500,
    category: 'All',
  });

  // Current active day schedule
  const currentDay = useMemo(() => {
    return schedules.find((s) => s.dayNumber === selectedDayNumber) || schedules[0];
  }, [schedules, selectedDayNumber]);

  // Filtered items in the current day
  const filteredItems = useMemo(() => {
    if (!currentDay) return [];
    return currentDay.items.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // Region
      if (filters.region !== 'All' && item.region !== filters.region) {
        return false;
      }

      // Audience
      if (filters.audience !== 'All' && item.audienceTag !== filters.audience) {
        return false;
      }

      // Senior friendly
      if (filters.seniorFriendlyOnly && !item.seniorFriendly) {
        return false;
      }

      // Wheelchair / step-free
      if (filters.wheelchairAccessOnly && item.accessibilityScore < 4) {
        return false;
      }

      // Student discount
      if (filters.studentDiscountOnly && !item.studentDiscount) {
        return false;
      }

      // Max cost
      if (item.estimatedCost > filters.maxCost) {
        return false;
      }

      return true;
    });
  }, [currentDay, searchQuery, filters]);

  // Toggle bookmark
  const handleToggleBookmark = (id: string) => {
    setSchedules((prev) =>
      prev.map((day) => ({
        ...day,
        items: day.items.map((item) =>
          item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
        ),
      }))
    );
  };

  // Toggle completed
  const handleToggleCompleted = (id: string) => {
    setSchedules((prev) =>
      prev.map((day) => ({
        ...day,
        items: day.items.map((item) =>
          item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        ),
      }))
    );
  };

  // When clicking Pin on Map from an itinerary card
  const handleSelectOnMap = (item: ItineraryItem) => {
    setActiveItemForMap(item);
    const matchedBeach = INITIAL_BEACHES.find(
      (b) =>
        item.title.toLowerCase().includes(b.name.toLowerCase().split(' ')[0]) ||
        item.address.toLowerCase().includes(b.name.toLowerCase().split(' ')[0])
    );
    if (matchedBeach) {
      setSelectedBeach(matchedBeach);
    }
    if (isPhoneFrame || window.innerWidth < 1024) {
      setActiveTab('map');
    }
  };

  // Maps Grounding triggers
  const handleOpenMapsGrounding = (item: ItineraryItem) => {
    setMapsGroundingTarget({
      placeName: item.title,
      address: item.address,
      region: item.region,
    });
  };

  const handleOpenBeachMapsGrounding = (beach: BeachGuide) => {
    setMapsGroundingTarget({
      placeName: beach.name,
      address: `${beach.name}, ${beach.region}, Goa`,
      region: beach.region,
    });
  };

  // Plan generated callback from AI Planner
  const handlePlanGenerated = (newSchedules: DaySchedule[]) => {
    setSchedules(newSchedules);
    setSelectedDayNumber(1);
    setActiveTab('itinerary');
  };

  const resetFilters = () => {
    setFilters({
      region: 'All',
      audience: 'All',
      seniorFriendlyOnly: false,
      wheelchairAccessOnly: false,
      studentDiscountOnly: false,
      maxCost: 1500,
      category: 'All',
    });
    setSearchQuery('');
  };

  // Active filter count
  const activeFilterCount =
    (filters.region !== 'All' ? 1 : 0) +
    (filters.audience !== 'All' ? 1 : 0) +
    (filters.seniorFriendlyOnly ? 1 : 0) +
    (filters.wheelchairAccessOnly ? 1 : 0) +
    (filters.studentDiscountOnly ? 1 : 0) +
    (filters.maxCost < 1500 ? 1 : 0);

  // Render Inner Content (shared between Responsive and Phone Frame modes)
  const renderMainContent = () => {
    return (
      <div className="flex-1 flex flex-col">
        {/* 1. ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Top Row: Title, Summary & Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D94] bg-[#E6F6F5] px-2.5 py-0.5 rounded-full">
                      Multi-Generational Itinerary
                    </span>
                    <span className="text-xs font-semibold text-[#5C6E6A]">
                      {schedules.length} Days Planned
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#243330] tracking-tight">
                    {currentDay?.title || 'Daily Planner'}
                  </h1>
                  <p className="text-sm md:text-base font-medium text-[#5C6E6A] mt-1">
                    {currentDay?.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <TactileButton
                    variant="outline"
                    size="small"
                    onClick={() => setIsFilterSheetOpen(true)}
                    icon={<SlidersHorizontal className="w-4 h-4 text-[#0F9D94]" />}
                  >
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#0F9D94] text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </TactileButton>

                  <TactileButton
                    variant="secondary"
                    size="small"
                    onClick={() => setIsAIModalOpen(true)}
                    icon={<Sparkles className="w-4 h-4 fill-white" />}
                  >
                    AI Customize
                  </TactileButton>
                </div>
              </div>

              {/* Day Pills Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {schedules.map((schedule) => {
                  const isSelected = schedule.dayNumber === selectedDayNumber;
                  const isNorth = schedule.region === 'North Goa';

                  return (
                    <button
                      key={schedule.dayNumber}
                      onClick={() => setSelectedDayNumber(schedule.dayNumber)}
                      className={`min-h-[48px] px-4 py-2 rounded-xl text-left transition-all cursor-pointer shrink-0 border-2 ${
                        isSelected
                          ? 'border-[#0F9D94] bg-white shadow-tactile-2'
                          : 'border-[#5C6E6A]/15 bg-white/60 hover:bg-white hover:border-[#5C6E6A]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isNorth ? 'bg-[#FF8A3D]' : 'bg-[#0F9D94]'
                          }`}
                        />
                        <span className="font-extrabold text-sm text-[#243330] whitespace-nowrap">
                          Day {schedule.dayNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5C6E6A] font-semibold truncate max-w-[150px] mt-0.5">
                        {schedule.region}
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="min-h-[48px] px-3.5 py-2 rounded-xl border-2 border-dashed border-[#FF8A3D]/60 hover:border-[#FF8A3D] bg-[#FFF1E8]/50 text-[#D05912] font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Add another day using AI planner"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Day</span>
                </button>
              </div>

              {/* Search bar with Microphone Voice Search button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 absolute left-3.5 text-[#5C6E6A]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search spots, shacks, bakeries, or activities..."
                    className="w-full min-h-[48px] pl-10 pr-24 rounded-xl bg-white border border-[#5C6E6A]/20 text-sm font-medium text-[#243330] placeholder-[#5C6E6A]/70 focus:outline-none focus:border-[#0F9D94] focus:ring-2 focus:ring-[#0F9D94]/20"
                  />
                  {/* Microphone speech-to-text trigger button */}
                  <div className="absolute right-2 flex items-center gap-1.5">
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs font-bold text-[#5C6E6A] hover:text-[#243330] px-1"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={() => setIsVoiceModalOpen(true)}
                      className="w-8 h-8 rounded-lg bg-[#FFF1E8] hover:bg-[#FF8A3D] text-[#D05912] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Voice search (powered by gemini-3.5-transcribe)"
                      aria-label="Search by voice"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="min-h-[48px] px-3.5 rounded-xl bg-white border border-[#E6D8C8] text-xs font-bold text-[#D05912] hover:bg-[#FFF1E8] flex items-center justify-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Reset {activeFilterCount} Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* ENHANCED 5-DAY COASTAL WEATHER FORECAST & BEACH ADVISOR CALLOUT */}
            {/* Fetches live public weather API data and provides specific beach advice */}
            <WeatherForecastCallout
              onSelectBeach={(beachName) => {
                const b = INITIAL_BEACHES.find((item) =>
                  item.name.toLowerCase().includes(beachName.toLowerCase().split(' ')[0])
                );
                if (b) setSelectedBeach(b);
              }}
            />

            {/* Split Screen Layout on Desktop (1024px+) per design spec */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Itinerary Timeline (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Hero banner for the day */}
                <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden shadow-tactile-1 border border-[#5C6E6A]/15 group">
                  <img
                    src={currentDay?.heroImage || '/src/assets/images/goa_palolem_beach_1791444781530.jpg'}
                    alt={currentDay?.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#0F9D94]">
                        {currentDay?.region}
                      </span>
                      <span className="text-xs font-medium text-white/90">
                        {currentDay?.dateLabel}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black drop-shadow-sm">
                      {currentDay?.title}
                    </h2>
                  </div>
                </div>

                {/* Itinerary Cards List */}
                {filteredItems.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-[#5C6E6A]/20 shadow-tactile-1">
                    <Compass className="w-10 h-10 text-[#5C6E6A]/40 mx-auto mb-2" />
                    <h3 className="font-extrabold text-lg text-[#243330]">
                      No activities match your filters
                    </h3>
                    <p className="text-sm text-[#5C6E6A] mt-1 max-w-sm mx-auto">
                      Try relaxing your cost limit or selecting "All Audiences" to see more Goan spots.
                    </p>
                    <div className="mt-4">
                      <TactileButton variant="primary" size="small" onClick={resetFilters}>
                        Reset Filters
                      </TactileButton>
                    </div>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <ItineraryCard
                      key={item.id}
                      item={item}
                      onSelectOnMap={handleSelectOnMap}
                      onToggleBookmark={handleToggleBookmark}
                      onToggleCompleted={handleToggleCompleted}
                      onOpenMapsGrounding={handleOpenMapsGrounding}
                      isActive={activeItemForMap?.id === item.id}
                    />
                  ))
                )}
              </div>

              {/* Right Column on Desktop: Persistent Interactive Coastal Map (5 cols) */}
              <div className="hidden lg:block lg:col-span-5 sticky top-24 space-y-4">
                <CoastalMap
                  selectedBeach={selectedBeach}
                  onSelectBeach={setSelectedBeach}
                  activeItem={activeItemForMap}
                  onOpenMapsGrounding={handleOpenBeachMapsGrounding}
                />

                {/* Quick Goan Taxi & Local Advice Box */}
                <div className="p-4 rounded-2xl bg-white border border-[#5C6E6A]/15 shadow-tactile-1 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[#243330]">
                    <span className="flex items-center gap-1.5 text-[#0F9D94]">
                      <Compass className="w-4 h-4 text-[#0F9D94]" />
                      Local Transit Wisdom
                    </span>
                    <span className="text-[#5C6E6A]">Commercial Plates Only</span>
                  </div>
                  <p className="text-[#5C6E6A] leading-relaxed">
                    Always confirm yellow commercial license plates when renting scooters (₹350/day). For cross-coast trips from MOPA or Dabolim airport, book fixed-rate AC cabs via GoaMiles counters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MAP & BEACH GUIDE TAB */}
        {activeTab === 'map' && (
          <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D94] bg-[#E6F6F5] px-2.5 py-0.5 rounded-full">
                Interactive Exploration
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#243330] mt-1">
                Goan Coastal Map & Beach Inspector
              </h2>
              <p className="text-sm font-medium text-[#5C6E6A] mt-0.5">
                Compare North Goa cliffs and backpacker cafes against tranquil South Goa crescent lagoons.
              </p>
            </div>

            <CoastalMap
              selectedBeach={selectedBeach}
              onSelectBeach={setSelectedBeach}
              activeItem={activeItemForMap}
              onOpenMapsGrounding={handleOpenBeachMapsGrounding}
            />
          </div>
        )}

        {/* 3. AI PLANNER TAB */}
        {activeTab === 'planner' && (
          <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#5C6E6A]/15 shadow-tactile-2 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#fe893c] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#FF8A3D]/30 mb-4">
                <Sun className="w-8 h-8 animate-spin-slow" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#243330]">
                Custom Goa Vacation Generator
              </h2>
              <p className="text-base text-[#5C6E6A] mt-2 leading-relaxed">
                Tailor a personalized itinerary balancing student hotspots, budget scooter trails, and step-free senior accessible beach cabanas.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <TactileButton
                  variant="secondary"
                  size="large"
                  onClick={() => setIsAIModalOpen(true)}
                  icon={<Sparkles className="w-5 h-5 fill-white" />}
                >
                  Open AI Itinerary Builder
                </TactileButton>
                <TactileButton
                  variant="outline"
                  size="large"
                  onClick={() => setIsVoiceModalOpen(true)}
                  icon={<Mic className="w-5 h-5 text-[#FF8A3D]" />}
                >
                  Speak Travel Wish
                </TactileButton>
              </div>
            </div>
          </div>
        )}

        {/* 4. LOCAL GUIDE & SAFETY TAB */}
        {activeTab === 'guide' && (
          <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D94] bg-[#E6F6F5] px-2.5 py-0.5 rounded-full">
                Safety & Insider Directory
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#243330] mt-1">
                Goa Tourist Safety, Helplines & Local Tips
              </h2>
              <p className="text-sm font-medium text-[#5C6E6A] mt-0.5">
                Verified emergency hospital contacts, Drishti lifeguard protocol, and official taxi rates.
              </p>
            </div>
            <LocalGuide />
          </div>
        )}

        {/* 5. BUDGET CALCULATOR TAB */}
        {activeTab === 'budget' && (
          <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F9D94] bg-[#E6F6F5] px-2.5 py-0.5 rounded-full">
                Financial Planner
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#243330] mt-1">
                Multi-Generational Travel Budget & Split
              </h2>
              <p className="text-sm font-medium text-[#5C6E6A] mt-0.5">
                Calculate total and per-person estimates for scooties, AC cabs, beach shacks, and resorts.
              </p>
            </div>
            <BudgetCalculator />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#243330] flex flex-col selection:bg-[#0F9D94]/20 selection:text-[#0F9D94]">
      {/* TOP BAR CONTRACT: Zone 1 (Wordmark) — Zone 2 (Nav links) — Zone 3 (Actions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#5C6E6A]/15 px-4 md:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('itinerary');
              }}
              className="text-2xl font-black tracking-tight text-[#006761] hover:text-[#0F9D94] transition-colors"
            >
              GoaVibe
            </a>
            <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFF1E8] text-[#D05912] border border-[#FF8A3D]/30">
              Tropical Tactile
            </span>
          </div>

          {/* Zone 2: Clean 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#5C6E6A]">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`hover:text-[#0F9D94] transition-colors cursor-pointer ${
                activeTab === 'itinerary' ? 'text-[#0F9D94] font-extrabold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`hover:text-[#0F9D94] transition-colors cursor-pointer ${
                activeTab === 'map' ? 'text-[#0F9D94] font-extrabold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Coastal Map
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`hover:text-[#0F9D94] transition-colors cursor-pointer ${
                activeTab === 'guide' ? 'text-[#0F9D94] font-extrabold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Guide & Safety
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`hover:text-[#0F9D94] transition-colors cursor-pointer ${
                activeTab === 'budget' ? 'text-[#0F9D94] font-extrabold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              Budget Split
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions + Device Viewport Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Viewport simulation toggle: Mobile Frame vs Desktop */}
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-[#5C6E6A]/25 text-xs font-bold text-[#5C6E6A] hover:text-[#243330] hover:bg-[#FFF9F2] flex items-center gap-1.5 transition-all cursor-pointer"
              title="Toggle between Mobile Phone simulator and Desktop view"
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-4 h-4 text-[#0F9D94]" />
                  <span className="hidden sm:inline">Desktop Split View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-[#FF8A3D]" />
                  <span className="hidden sm:inline">Mobile Frame View</span>
                </>
              )}
            </button>

            <TactileButton
              variant="primary"
              size="small"
              onClick={() => setIsAIModalOpen(true)}
              icon={<Sparkles className="w-4 h-4 fill-white" />}
            >
              <span className="hidden sm:inline">+ Plan Trip</span>
              <span className="sm:hidden">Plan</span>
            </TactileButton>
          </div>
        </div>
      </header>

      {/* Main Container: Conditioned on isPhoneFrame or standard responsive */}
      <main className="flex-1 flex flex-col">
        {isPhoneFrame ? (
          /* Phone Frame Container Simulator (390px iPhone ergonomic frame) */
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#ecfdf8]/50">
            <div className="w-full max-w-[400px] h-[844px] bg-[#FFF9F2] rounded-[44px] shadow-[0px_25px_60px_-15px_rgba(36,51,48,0.35)] border-[8px] border-[#243330] overflow-hidden flex flex-col relative">
              {/* Simulated iPhone Dynamic Island & Status Bar */}
              <div className="h-11 bg-white flex items-center justify-between px-6 shrink-0 select-none border-b border-[#5C6E6A]/10 text-xs font-bold text-[#243330]">
                <span>9:41</span>
                <div className="w-20 h-4 bg-[#243330] rounded-full mx-auto" />
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span className="w-4 h-2.5 border border-[#243330] rounded-xs inline-block relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bottom-0.5 after:w-2 after:bg-[#0F9D94]" />
                </div>
              </div>

              {/* Scrollable screen content */}
              <div className="flex-1 overflow-y-auto pb-20">
                {renderMainContent()}
              </div>

              {/* Pinned 64px Mobile Bottom Navigation Bar inside phone frame */}
              <nav
                className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-[rgba(84,58,30,0.08)] grid grid-cols-5 items-center px-1 z-30 select-none"
                style={{ height: '64px' }}
                aria-label="Mobile Navigation"
              >
                {[
                  { id: 'itinerary', label: 'Itinerary', icon: Calendar },
                  { id: 'map', label: 'Coast Map', icon: Compass },
                  { id: 'planner', label: 'AI Plan', icon: Sparkles, accent: true },
                  { id: 'guide', label: 'Safety', icon: ShieldCheck },
                  { id: 'budget', label: 'Budget', icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'planner') {
                          setIsAIModalOpen(true);
                        } else {
                          setActiveTab(item.id as any);
                        }
                      }}
                      className="min-h-[48px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon
                        className={`w-5 h-5 transition-transform ${
                          isActive
                            ? 'text-[#0F9D94] scale-110'
                            : item.accent
                            ? 'text-[#FF8A3D]'
                            : 'text-[#5C6E6A]'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[10px] font-bold tracking-tight ${
                          isActive
                            ? 'text-[#0F9D94]'
                            : item.accent
                            ? 'text-[#FF8A3D]'
                            : 'text-[#5C6E6A]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        ) : (
          /* Standard Fluid Viewport (Responsive Mobile -> Tablet -> Desktop) */
          <div className="flex-1 flex flex-col pb-20 md:pb-8">
            {renderMainContent()}
          </div>
        )}
      </main>

      {/* Persistent Mobile Bottom Navigation Bar (Visible on mobile screens <= 768px when NOT in phone simulation) */}
      {!isPhoneFrame && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[rgba(84,58,30,0.08)] grid grid-cols-5 items-center px-2 z-40 select-none shadow-[0_-4px_16px_rgba(84,58,30,0.06)]"
          style={{ height: '64px' }}
          aria-label="Mobile Navigation"
        >
          {[
            { id: 'itinerary', label: 'Itinerary', icon: Calendar },
            { id: 'map', label: 'Coast Map', icon: Compass },
            { id: 'planner', label: 'AI Plan', icon: Sparkles, accent: true },
            { id: 'guide', label: 'Safety', icon: ShieldCheck },
            { id: 'budget', label: 'Budget', icon: Wallet },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'planner') {
                    setIsAIModalOpen(true);
                  } else {
                    setActiveTab(item.id as any);
                  }
                }}
                className="min-h-[48px] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? 'text-[#0F9D94] scale-110'
                      : item.accent
                      ? 'text-[#FF8A3D]'
                      : 'text-[#5C6E6A]'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-[10px] font-bold tracking-tight ${
                    isActive
                      ? 'text-[#0F9D94]'
                      : item.accent
                      ? 'text-[#FF8A3D]'
                      : 'text-[#5C6E6A]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* AI Itinerary Generator Modal */}
      <AIPlannerModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Travel & Accessibility Filters Sheet */}
      <TravelFiltersSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onChangeFilters={setFilters}
        onReset={resetFilters}
      />

      {/* Google Maps Grounding Details Modal */}
      {mapsGroundingTarget && (
        <MapsGroundingModal
          isOpen={!!mapsGroundingTarget}
          onClose={() => setMapsGroundingTarget(null)}
          placeName={mapsGroundingTarget.placeName}
          address={mapsGroundingTarget.address}
          region={mapsGroundingTarget.region}
        />
      )}

      {/* Audio Transcription & Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptionComplete={(text) => setSearchQuery(text)}
      />

      {/* Footer on desktop */}
      <footer className="hidden md:block py-6 border-t border-[#5C6E6A]/10 bg-white text-center text-xs text-[#5C6E6A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#006761]">GoaVibe</span>
            <span>· Tropical Sunkissed Tactile Travel Companion</span>
          </div>
          <div>
            <span>WCAG AAA Accessible · Live Public Weather API · Maps Grounded</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
