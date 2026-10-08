import React, { useState } from 'react';
import {
  Wallet,
  Users,
  Calendar,
  Percent,
  Car,
  Utensils,
  Home,
  CheckCircle2,
  Info
} from 'lucide-react';
import { TactileButton } from './TactileButton';

export const BudgetCalculator: React.FC = () => {
  const [days, setDays] = useState<number>(4);
  const [people, setPeople] = useState<number>(2);
  const [transportType, setTransportType] = useState<'scooter' | 'taxi' | 'bus'>('taxi');
  const [stayType, setStayType] = useState<'hostel' | 'resort' | 'villa'>('resort');
  const [foodType, setFoodType] = useState<'shack' | 'balanced' | 'luxury'>('balanced');
  const [applyStudentDiscount, setApplyStudentDiscount] = useState<boolean>(false);

  // Daily rates in INR
  const transportRates = {
    scooter: 350, // per scooter (assume 1 scooter per 2 people)
    taxi: 1800,   // AC private cab per day
    bus: 60,      // per person
  };

  const stayRates = {
    hostel: 700,    // per person / night
    resort: 2800,   // per room (2 people per room)
    villa: 6500,    // per private heritage villa suite
  };

  const foodRates = {
    shack: 450,     // per person per day (thali + poi + coconut)
    balanced: 950,  // per person per day (cafes + seafood shack)
    luxury: 2200,   // per person per day (fine dining coastal)
  };

  const activitiesRatePerPersonDay = 350; // ferry, heritage entry, water sports avg

  // Calculations
  const totalTransport =
    transportType === 'scooter'
      ? Math.ceil(people / 2) * transportRates.scooter * days
      : transportType === 'taxi'
      ? transportRates.taxi * days
      : transportRates.bus * people * days;

  const totalStay =
    stayType === 'hostel'
      ? stayRates.hostel * people * days
      : Math.ceil(people / 2) * stayRates.resort * days;

  const totalFood = foodRates[foodType] * people * days;
  const totalActivities = activitiesRatePerPersonDay * people * days;

  const rawTotal = totalTransport + totalStay + totalFood + totalActivities;
  const finalTotal = applyStudentDiscount ? Math.round(rawTotal * 0.88) : rawTotal;
  const perPersonTotal = Math.round(finalTotal / people);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#5C6E6A]/15 shadow-tactile-1 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#5C6E6A]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0F9D94] text-white flex items-center justify-center shadow-md">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#243330]">
              Goa Travel Budget & Split Calculator
            </h3>
            <p className="text-xs font-semibold text-[#5C6E6A]">
              Transparent cost estimates for students, couples & multi-gen families
            </p>
          </div>
        </div>
      </div>

      {/* Inputs: Days, Travelers & Student Switch */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8]">
          <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2">
            Trip Duration
          </label>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-9 h-9 rounded-lg bg-white border border-[#5C6E6A]/20 font-black text-lg hover:bg-[#E6F6F5]"
            >
              -
            </button>
            <span className="font-extrabold text-xl text-[#243330] font-mono tabular-nums">
              {days} Days
            </span>
            <button
              onClick={() => setDays(Math.min(14, days + 1))}
              className="w-9 h-9 rounded-lg bg-white border border-[#5C6E6A]/20 font-black text-lg hover:bg-[#E6F6F5]"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8]">
          <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2">
            Travel Party Size
          </label>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="w-9 h-9 rounded-lg bg-white border border-[#5C6E6A]/20 font-black text-lg hover:bg-[#E6F6F5]"
            >
              -
            </button>
            <span className="font-extrabold text-xl text-[#243330] font-mono tabular-nums">
              {people} {people === 1 ? 'Person' : 'People'}
            </span>
            <button
              onClick={() => setPeople(Math.min(12, people + 1))}
              className="w-9 h-9 rounded-lg bg-white border border-[#5C6E6A]/20 font-black text-lg hover:bg-[#E6F6F5]"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#E6D8C8] flex flex-col justify-between">
          <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-1">
            Student / Youth ID
          </label>
          <button
            onClick={() => setApplyStudentDiscount(!applyStudentDiscount)}
            className={`min-h-[44px] px-3 rounded-lg font-bold text-xs flex items-center justify-between border cursor-pointer transition-all ${
              applyStudentDiscount
                ? 'bg-[#FFF1E8] border-[#FF8A3D] text-[#D05912]'
                : 'bg-white border-[#5C6E6A]/20 text-[#5C6E6A]'
            }`}
          >
            <span>Apply 12% Student Pass</span>
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${
                applyStudentDiscount ? 'bg-[#FF8A3D]' : 'bg-[#5C6E6A]/30'
              }`}
            >
              ✓
            </span>
          </button>
        </div>
      </div>

      {/* Choice Selectors: Transport, Stay, Food */}
      <div className="space-y-4">
        {/* Transport Option */}
        <div>
          <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2">
            Transportation Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'scooter', label: 'Scooter / Bike', cost: '₹350/day' },
              { id: 'taxi', label: 'Private AC Taxi', cost: '₹1,800/day' },
              { id: 'bus', label: 'Electric AC Bus', cost: '₹60/trip' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTransportType(t.id as any)}
                className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                  transportType === t.id
                    ? 'border-[#0F9D94] bg-[#E6F6F5] text-[#096660]'
                    : 'border-[#5C6E6A]/20 bg-white text-[#243330]'
                }`}
              >
                <div className="font-bold text-sm">{t.label}</div>
                <div className="text-xs text-[#5C6E6A] mt-0.5">{t.cost}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div>
          <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2">
            Stay & Accommodation
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hostel', label: 'Beachside Hostel', cost: '₹700/night/person' },
              { id: 'resort', label: 'Coastal Resort Room', cost: '₹2,800/night' },
              { id: 'villa', label: 'Heritage Boutique Suite', cost: '₹4,500/night' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStayType(s.id as any)}
                className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                  stayType === s.id
                    ? 'border-[#0F9D94] bg-[#E6F6F5] text-[#096660]'
                    : 'border-[#5C6E6A]/20 bg-white text-[#243330]'
                }`}
              >
                <div className="font-bold text-sm">{s.label}</div>
                <div className="text-xs text-[#5C6E6A] mt-0.5">{s.cost}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Food */}
        <div>
          <label className="block text-xs font-extrabold text-[#5C6E6A] uppercase tracking-wider mb-2">
            Dining Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'shack', label: 'Authentic Beach Shacks', cost: '₹450/day' },
              { id: 'balanced', label: 'Cafes & Coastal Thalis', cost: '₹950/day' },
              { id: 'luxury', label: 'Fine Seafood Dining', cost: '₹2,200/day' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFoodType(f.id as any)}
                className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                  foodType === f.id
                    ? 'border-[#0F9D94] bg-[#E6F6F5] text-[#096660]'
                    : 'border-[#5C6E6A]/20 bg-white text-[#243330]'
                }`}
              >
                <div className="font-bold text-sm">{f.label}</div>
                <div className="text-xs text-[#5C6E6A] mt-0.5">{f.cost}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Card with Tabular Numbers */}
      <div className="p-5 rounded-2xl bg-[#FFF9F2] border-2 border-[#0F9D94]/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6D8C8]">
          <div>
            <span className="text-xs font-bold text-[#5C6E6A] uppercase tracking-wider block">
              Total Estimated Expense ({days} Days · {people} Guests)
            </span>
            <div className="text-3xl font-black text-[#0F9D94] font-mono tabular-nums mt-1">
              ₹{finalTotal.toLocaleString()}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-bold text-[#5C6E6A] uppercase tracking-wider block">
              Per Person Share
            </span>
            <div className="text-2xl font-black text-[#243330] font-mono tabular-nums mt-1">
              ₹{perPersonTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="space-y-1.5 text-xs font-semibold text-[#243330]">
          <div className="flex justify-between font-mono tabular-nums">
            <span>Stay: ₹{totalStay.toLocaleString()}</span>
            <span>Food: ₹{totalFood.toLocaleString()}</span>
            <span>Transport: ₹{totalTransport.toLocaleString()}</span>
            <span>Activities: ₹{totalActivities.toLocaleString()}</span>
          </div>

          <div className="h-3 w-full rounded-full bg-[#E6D8C8] overflow-hidden flex">
            <div
              className="bg-[#0F9D94]"
              style={{ width: `${(totalStay / rawTotal) * 100}%` }}
              title="Accommodation"
            />
            <div
              className="bg-[#FF8A3D]"
              style={{ width: `${(totalFood / rawTotal) * 100}%` }}
              title="Food"
            />
            <div
              className="bg-[#243330]"
              style={{ width: `${(totalTransport / rawTotal) * 100}%` }}
              title="Transport"
            />
            <div
              className="bg-[#096660]"
              style={{ width: `${(totalActivities / rawTotal) * 100}%` }}
              title="Activities"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
