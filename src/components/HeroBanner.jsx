import React from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  ArrowUpDown,
  Flame
} from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export default function HeroBanner({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  stats = {},
  onOpenReportModal,
  onOpenKioskQR
}) {
  return (
    <div className="bg-gradient-to-b from-[#070d19] via-[#091224] to-[#060b16] text-white pt-10 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-cyan-500/20">
      
      {/* Background Ambient Neon Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold mb-3 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Civic Problem Intelligence & Municipal Accountability</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              FixLocal <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent neon-text-glow">
                Decentralized Civic Action Platform.
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Empowering students and citizens to flag road hazards, broken streetlights, water pipeline leaks, and illegal dumping. Upvote neighborhood issues to trigger expedited municipal SLAs.
            </p>
          </div>

          {/* Quick Neon Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <div className="bg-[#0e172a]/90 backdrop-blur-md border border-cyan-500/20 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Total Reports</span>
              <span className="text-2xl font-black text-white mt-0.5 block font-mono">{stats.totalIssues || 0}</span>
              <span className="text-[10px] text-cyan-400 font-semibold flex items-center mt-0.5">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active Tracking
              </span>
            </div>

            <div className="bg-[#0e172a]/90 backdrop-blur-md border border-cyan-500/20 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Resolution Rate</span>
              <span className="text-2xl font-black text-cyan-400 mt-0.5 block font-mono">{stats.resolutionRate || 0}%</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Municipal SLA</span>
            </div>

            <div className="bg-[#0e172a]/90 backdrop-blur-md border border-cyan-500/20 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Endorsements</span>
              <span className="text-2xl font-black text-amber-400 mt-0.5 block font-mono">{stats.totalUpvotes || 0}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Citizen Upvotes</span>
            </div>

            <div className="bg-[#0e172a]/90 backdrop-blur-md border border-rose-500/30 p-3.5 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider block">Critical Alerts</span>
              <span className="text-2xl font-black text-rose-400 mt-0.5 block font-mono">{stats.criticalPending || 0}</span>
              <span className="text-[10px] text-rose-300 font-semibold flex items-center mt-0.5">
                <AlertTriangle className="w-3 h-3 mr-1" /> Expedited 6h
              </span>
            </div>
          </div>
        </div>

        {/* Search, Filter Bar & Quick Controls */}
        <div className="bg-[#0b1324]/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues by title, street name, pothole, streetlights, or ward..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#070d19] text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Selector */}
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="flex bg-[#070d19] p-1 rounded-xl border border-slate-700 text-xs font-bold">
                {['all', 'Reported', 'In Progress', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-all ${
                      selectedStatus === st
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {st === 'all' ? 'All Statuses' : st}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#070d19] text-slate-200 text-xs font-bold px-3 py-2 pr-7 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="trending">🔥 Most Upvoted</option>
                  <option value="recent">⏱️ Newest First</option>
                  <option value="severity">⚠️ High Severity</option>
                </select>
                <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>

              {/* QR Poster Button */}
              <button
                onClick={onOpenKioskQR}
                title="Generate Locality Kiosk QR Poster"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40 border border-slate-700 text-xs font-bold whitespace-nowrap transition-all shadow-sm"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Kiosk QR</span>
              </button>
            </div>

          </div>

          {/* Category Quick Badges */}
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-800 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center whitespace-nowrap">
              <Filter className="w-3 h-3 mr-1 text-cyan-400" /> Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.35)]'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1 rounded-lg font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block shadow-sm"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
