import React from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Download,
  Printer,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

export default function AnalyticsDashboard({
  analytics,
  onResetData
}) {
  if (!analytics || !analytics.summary) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="font-semibold text-sm">Aggregating municipal telemetry...</p>
      </div>
    );
  }

  const { summary, categories = [], severities = {}, hotspots = [] } = analytics;

  const handleExportCSV = () => {
    const csvRows = [];
    csvRows.push(['FIXLOCAL CIVIC OPERATIONS ANALYTICS REPORT']);
    csvRows.push([`Generated At: ${new Date().toLocaleString()}`]);
    csvRows.push([]);
    csvRows.push(['Metric', 'Value']);
    csvRows.push(['Total Reported Issues', summary.totalIssues]);
    csvRows.push(['Resolved Issues', summary.resolvedCount]);
    csvRows.push(['In Progress Issues', summary.inProgressCount]);
    csvRows.push(['Pending Reported Issues', summary.reportedCount]);
    csvRows.push(['Resolution Rate', `${summary.resolutionRate}%`]);
    csvRows.push(['Average Turnaround Time', `${summary.avgResolutionHours} Hours`]);
    csvRows.push(['Critical Pending Alerts', summary.criticalPending]);
    csvRows.push(['Total Citizen Upvotes', summary.totalUpvotes]);
    csvRows.push([]);
    csvRows.push(['CATEGORY BREAKDOWN']);
    csvRows.push(['Category Name', 'Issue Count', 'Percentage']);
    categories.forEach(c => csvRows.push([c.name, c.count, `${c.percentage}%`]));
    csvRows.push([]);
    csvRows.push(['HOTSPOT WARD RANKINGS']);
    csvRows.push(['Ward', 'Locality', 'Pending Issues', 'Total Issues']);
    hotspots.forEach(h => csvRows.push([h.ward, h.locality, h.pending, h.total]));

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fixlocal_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1427] p-6 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              FixLocal Municipal Intelligence Platform
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Civic Resolution Analytics & Authority KPI Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time department accountability, SLA turnaround metrics, and ward priority heatmaps
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 no-print">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] active:scale-95"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          <button
            onClick={onResetData}
            title="Reset to initial seed dataset"
            className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-800 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Issues */}
        <div className="bg-[#0e172a] p-5 rounded-3xl border border-cyan-500/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Reports</span>
            <div className="w-9 h-9 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white font-mono">{summary.totalIssues}</span>
            <span className="text-xs text-slate-400 font-medium block mt-1">
              Logged across 8 active wards
            </span>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-[#0e172a] p-5 rounded-3xl border border-cyan-500/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Resolution Rate</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-400 font-mono">{summary.resolutionRate}%</span>
              <span className="text-xs font-bold text-emerald-400">Completed</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                style={{ width: `${summary.resolutionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Avg Resolution Turnaround */}
        <div className="bg-[#0e172a] p-5 rounded-3xl border border-cyan-500/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Avg SLA Turnaround</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white font-mono">{summary.avgResolutionHours}h</span>
              <span className="text-xs font-bold text-amber-400">Average</span>
            </div>
            <span className="text-xs text-slate-400 font-medium block mt-1">
              From citizen dispatch to signoff
            </span>
          </div>
        </div>

        {/* Critical Alerts Pending */}
        <div className="bg-[#0e172a] p-5 rounded-3xl border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">Critical Pending</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-rose-400 font-mono">{summary.criticalPending}</span>
              <span className="text-xs font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded-full border border-rose-500/40">
                6h SLA
              </span>
            </div>
            <span className="text-xs text-rose-400/80 font-medium block mt-1">
              Hazards needing priority repair
            </span>
          </div>
        </div>

      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown */}
        <div className="lg:col-span-7 bg-[#0c1427] p-6 rounded-3xl border border-cyan-500/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">
                Civic Issues by Category
              </h3>
              <p className="text-xs text-slate-400">Distribution across municipal service wings</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {categories.length} Sectors
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {categories.map((cat) => {
              const catMeta = CATEGORIES.find(c => c.id === cat.name);
              const color = catMeta ? catMeta.color : '#00f0ff';

              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center">
                      <span className="w-2.5 h-2.5 rounded-full mr-2 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color }} />
                      {cat.name}
                    </span>
                    <span className="font-mono text-slate-400 font-semibold">
                      {cat.count} reports ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Funnel & Severity Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Status Pipeline */}
          <div className="bg-[#0c1427] p-6 rounded-3xl border border-cyan-500/20 shadow-sm space-y-4">
            <h3 className="text-base font-black text-white">
              Resolution Pipeline Funnel
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-3 rounded-2xl bg-[#0e172a] border border-amber-500/40">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-300 block">Reported</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block font-mono">{summary.reportedCount}</span>
                <span className="text-[10px] text-slate-400">Queued</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0e172a] border border-cyan-500/40">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-300 block">In Progress</span>
                <span className="text-2xl font-black text-cyan-400 mt-1 block font-mono">{summary.inProgressCount}</span>
                <span className="text-[10px] text-slate-400">Deployed</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0e172a] border border-emerald-500/40">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-300 block">Resolved</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">{summary.resolvedCount}</span>
                <span className="text-[10px] text-slate-400">Closed</span>
              </div>
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-[#0c1427] p-6 rounded-3xl border border-cyan-500/20 shadow-sm space-y-3">
            <h3 className="text-base font-black text-white">
              Severity Tier Breakdown
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-between">
                <span className="font-bold text-rose-300">Critical (6h)</span>
                <span className="font-mono font-black text-rose-400 text-sm">{severities.Critical || 0}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-orange-950/60 border border-orange-500/40 flex items-center justify-between">
                <span className="font-bold text-orange-300">High (24h)</span>
                <span className="font-mono font-black text-orange-400 text-sm">{severities.High || 0}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-between">
                <span className="font-bold text-cyan-300">Medium (72h)</span>
                <span className="font-mono font-black text-cyan-400 text-sm">{severities.Medium || 0}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-400">Low (120h)</span>
                <span className="font-mono font-black text-slate-300 text-sm">{severities.Low || 0}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Ward Hotspot Table */}
      <div className="bg-[#0c1427] rounded-3xl border border-cyan-500/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">
              Locality & Ward Hotspot Leaderboard
            </h3>
            <p className="text-xs text-slate-400">
              Prioritized by volume of pending unresolved civic tickets
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
            Top Priority Zones
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">Ward & Locality</th>
                <th className="py-3 px-6">Pending Tickets</th>
                <th className="py-3 px-6">Resolved Tickets</th>
                <th className="py-3 px-6">Total Reports</th>
                <th className="py-3 px-6 text-right">Municipal Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
              {hotspots.map((spot, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-white">
                    <span className="block text-white">{spot.ward}</span>
                    <span className="text-[11px] text-cyan-400 font-normal">{spot.locality}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-950 text-rose-300 border border-rose-500/40">
                      {spot.pending} Pending
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-emerald-400 font-mono">
                    {spot.resolved}
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-white">
                    {spot.total}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                      spot.pending >= 2 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {spot.pending >= 2 ? 'High Backlog' : 'Stable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
