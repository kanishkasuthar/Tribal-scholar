import React, { useState, useEffect } from 'react';
import { MapPin, Search, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import api from '../../services/api';

export const AdminDistricts: React.FC = () => {
  const [states, setStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>('Odisha');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await api.get('/admin/districts');
        if (res.data.success) {
          setStates(res.data.states || []);
        }
      } catch (e) {
        console.error('Failed to load geographic district data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  const currentState = states.find((s) => s.state === selectedState) || states[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-maroon-900 text-white p-6 rounded-2xl border-l-4 border-gold-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-md">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gold-300 bg-maroon-950/80 px-3 py-1 rounded border border-maroon-700">
            NATIONAL GEOGRAPHIC INTELLIGENCE
          </span>
          <h1 className="font-serif text-2xl font-extrabold mt-1 text-white">India → State → District Analytics Drill-Down</h1>
          <p className="text-xs text-ivory-200 mt-1 max-w-3xl">
            Monitor ST scholarship adoption, Tehsil verification backlogs, deficiency rates, and PFMS disbursements down to district levels.
          </p>
        </div>

        <div className="bg-maroon-950 px-4 py-2 rounded-xl border border-maroon-700 text-right shrink-0">
          <span className="text-[10px] text-ivory-300 uppercase block font-bold">States Covered</span>
          <strong className="text-lg font-extrabold text-gold-400">{states.length} Indian States</strong>
        </div>
      </div>

      {/* State Selector Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-ivory-300 shadow-xs flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-maroon-900 mr-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-terracotta-700" /> Select State:
        </span>
        {states.map((st) => (
          <button
            key={st.state}
            onClick={() => setSelectedState(st.state)}
            className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
              selectedState === st.state
                ? 'bg-maroon-900 text-white shadow-xs border border-maroon-950'
                : 'bg-ivory-100 text-maroon-900 hover:bg-maroon-50 border border-ivory-300'
            }`}
          >
            {st.state}
          </button>
        ))}
      </div>

      {/* Selected State Overview Metrics */}
      {currentState && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-xs">
            <span className="text-[10px] text-charcoal-600 font-bold uppercase block">Total Applications</span>
            <p className="text-xl font-black text-maroon-900">{currentState.totalApplications}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-xs">
            <span className="text-[10px] text-charcoal-600 font-bold uppercase block">Approved</span>
            <p className="text-xl font-black text-govgreen-700">{currentState.approved}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-xs">
            <span className="text-[10px] text-charcoal-600 font-bold uppercase block">Pending Verification</span>
            <p className="text-xl font-black text-amber-700">{currentState.pending}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-xs">
            <span className="text-[10px] text-charcoal-600 font-bold uppercase block">Disbursed Funds</span>
            <p className="text-xl font-black text-maroon-900">{currentState.disbursedAmount}</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-xs">
            <span className="text-[10px] text-charcoal-600 font-bold uppercase block">Avg Processing Days</span>
            <p className="text-xl font-black text-maroon-900">{currentState.avgDays} Days</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-ivory-300 shadow-xs">
            <span className="text-[10px] text-charcoal-600 font-bold uppercase block">Doc Deficiency Rate</span>
            <p className="text-xl font-black text-terracotta-700">{currentState.deficiencyRate}</p>
          </div>
        </div>
      )}

      {/* District Drill-down Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 shadow-xs overflow-hidden">
        <div className="p-4 bg-ivory-100/80 border-b border-ivory-300 flex justify-between items-center">
          <h3 className="font-serif font-bold text-base text-maroon-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-terracotta-700" /> District Breakdown — {currentState?.state}
          </h3>
          <span className="text-[10px] font-bold text-charcoal-600 uppercase">
            {currentState?.districts?.length || 0} Key Tribal Districts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-100 text-maroon-950 font-serif font-bold border-b border-ivory-300">
              <tr>
                <th className="p-3.5">District Name</th>
                <th className="p-3.5">Applications</th>
                <th className="p-3.5">Approved</th>
                <th className="p-3.5">Pending Verification</th>
                <th className="p-3.5">Returned Files</th>
                <th className="p-3.5">Disbursed Funds</th>
                <th className="p-3.5">Avg Processing Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {currentState?.districts?.map((dist: any, idx: number) => (
                <tr key={idx} className="hover:bg-ivory-100/70 transition-colors">
                  <td className="p-3.5 font-bold text-maroon-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-700" /> {dist.district} District
                  </td>
                  <td className="p-3.5 font-bold text-charcoal-900">{dist.applications}</td>
                  <td className="p-3.5 font-bold text-govgreen-700">{dist.approved}</td>
                  <td className="p-3.5 font-bold text-amber-700">{dist.pending}</td>
                  <td className="p-3.5 font-bold text-terracotta-700">{dist.returned}</td>
                  <td className="p-3.5 font-black text-maroon-900">{dist.disbursed}</td>
                  <td className="p-3.5 font-medium text-charcoal-800">{dist.avgDays} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

