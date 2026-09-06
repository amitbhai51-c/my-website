import React from 'react';
import {
  MapPin,
  PlusCircle,
  BarChart3,
  Map as MapIcon,
  ListFilter,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenAuthModal,
  currentUser,
  onLogout,
  unresolvedCount = 0
}) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-[#070d19]/90 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <span className="font-black text-lg">⚡</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Fix<span className="text-cyan-400">Local</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  Civic OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">
                Next-Gen Local Problem Reporting & Resolution
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'feed'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ListFilter className="w-4 h-4 text-cyan-400" />
              <span>Issues Feed</span>
              {unresolvedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-slate-800 text-cyan-300 border border-cyan-500/30">
                  {unresolvedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapIcon className="w-4 h-4 text-sky-400" />
              <span>Interactive Map</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>City Analytics</span>
            </button>

            {/* Admin Portal Tab - Highlighted if Admin */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400'
                    : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              </button>
            )}
          </nav>

          {/* Right Action Area: User Profile / Auth + Report CTA */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* User Profile Pill or Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 p-1 pl-2.5 rounded-xl bg-slate-900 border border-slate-700">
                <div className="text-left hidden lg:block">
                  <span className="text-xs font-bold text-white block leading-none">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isAdmin ? 'text-cyan-400' : 'text-slate-400'
                  }`}>
                    {isAdmin ? 'Municipal Admin' : 'Citizen'}
                  </span>
                </div>
                
                {isAdmin ? (
                  <button
                    onClick={() => setActiveTab('admin')}
                    title="Open Admin Portal"
                    className="p-1.5 rounded-lg bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-500/40"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </button>
                ) : (
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <button
                  onClick={onLogout}
                  title="Log out of account"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Quick Report CTA with Neon Cyan Gradient */}
            <button
              onClick={onOpenReportModal}
              className="relative inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Report Issue</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 justify-around">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold ${
              activeTab === 'feed' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold ${
              activeTab === 'map' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold ${
              activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Analytics</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-bold ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'text-indigo-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
