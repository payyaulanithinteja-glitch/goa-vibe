import React from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Shield,
  LifeBuoy,
  Hospital,
  Car,
  Lightbulb,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { EMERGENCY_CONTACTS, LOCAL_TRAVEL_TIPS } from '../data/goaData';
import { RegionBadge } from './RegionBadge';
import { TactileButton } from './TactileButton';

export const LocalGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Tertiary Warm Coral Travel Alert Banner */}
      <div
        className="p-5 md:p-6 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start gap-4 shadow-tactile-1"
        style={{
          backgroundColor: '#FFF2F0',
          borderColor: '#E0533C',
        }}
        role="alert"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
          style={{ backgroundColor: '#E0533C' }}
        >
          <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide text-white"
              style={{ backgroundColor: '#E0533C' }}
            >
              Official Coastal Safety Notice
            </span>
            <span className="text-xs font-semibold text-[#5C6E6A]">Updated for 2026</span>
          </div>
          <h4 className="text-xl font-extrabold text-[#243330]">
            Beach Swimming Flags & Lifeguard Protocol
          </h4>
          <p className="text-base text-[#243330] mt-1 leading-relaxed">
            Always observe Drishti lifesaver flags along all 40 Goan beaches.
            <strong> Red flags indicate high undercurrents</strong>—do not enter the sea.
            Green zones indicate monitored safe waters, ideal for seniors and wading.
          </p>
        </div>
      </div>

      {/* Emergency & Helpline Directory */}
      <div className="bg-white rounded-2xl p-6 border border-[#5C6E6A]/15 shadow-tactile-1">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#5C6E6A]/10">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#0F9D94]" />
            <h3 className="text-xl font-extrabold text-[#243330]">
              24x7 Goa Tourist Helplines & Hospitals
            </h3>
          </div>
          <span className="text-xs font-bold text-[#0F9D94] bg-[#E6F6F5] px-3 py-1 rounded-full">
            One-Tap Dial
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {EMERGENCY_CONTACTS.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-white border border-[#5C6E6A]/20 text-[#5C6E6A]">
                    {item.category}
                  </span>
                  <a
                    href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                    className="font-mono font-extrabold text-base text-[#0F9D94] hover:underline flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    {item.number}
                  </a>
                </div>
                <h4 className="font-extrabold text-base text-[#243330] mt-2">
                  {item.title}
                </h4>
                <p className="text-sm text-[#5C6E6A] mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E6D8C8]/60">
                <a
                  href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg bg-white border border-[#0F9D94] text-[#0F9D94] font-bold text-xs hover:bg-[#E6F6F5] transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call {item.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Goan Vacation Guidelines */}
      <div className="bg-white rounded-2xl p-6 border border-[#5C6E6A]/15 shadow-tactile-1">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#5C6E6A]/10">
          <Lightbulb className="w-5 h-5 text-[#FF8A3D]" />
          <h3 className="text-xl font-extrabold text-[#243330]">
            Local Insider Wisdom & Practical Tips
          </h3>
        </div>

        <div className="space-y-4">
          {LOCAL_TRAVEL_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-[#5C6E6A]/15 hover:border-[#FF8A3D]/50 transition-all flex flex-col sm:flex-row sm:items-start gap-3"
            >
              <div className="shrink-0">
                <RegionBadge audienceTag={tip.audience as any} size="sm" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#243330]">
                  {tip.title}
                </h4>
                <p className="text-sm text-[#243330]/85 mt-1 leading-relaxed">
                  {tip.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
