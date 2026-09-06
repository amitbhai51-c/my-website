import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Eye,
  Send,
  Download,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Building,
  User,
  AlertOctagon,
  ArrowUpDown
} from 'lucide-react';
import { STATUS_CONFIG, SEVERITY_CONFIG, CATEGORIES } from '../utils/constants';

export default function AdminPortal({
  issues = [],
  currentUser,
  onUpdateStatus,
  onDeleteIssue,
  onSelectIssue,
  onResetData
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Quick Action Modal state for logging official remark
  const [actionTicket, setActionTicket] = useState(null); // ticket being updated
  const [targetStatus, setTargetStatus] = useState('In Progress');
  const [actionNote, setActionNote] = useState('');
  const [assignedDept, setAssignedDept] = useState('Public Works Dept');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter list
  const filteredIssues = issues.filter(issue => {
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.locality.toLowerCase().includes(q) ||
        issue.reportedBy.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenAction = (issue, status) => {
    setActionTicket(issue);
    setTargetStatus(status);
    setAssignedDept(issue.suggestedDepartment || currentUser?.department || 'Public Works Dept');
    setActionNote(
      status === 'Resolved'
        ? `Field repair completed. Surface restored and safety audit verified by ${currentUser?.name || 'Officer'}.`
        : `Field dispatch approved. Maintenance crew deployed under work order #FL-${Math.floor(1000 + Math.random() * 9000)}.`
    );
  };

  const handleCommitAction = async (e) => {
    e.preventDefault();
    if (!actionTicket) return;
    setIsSubmitting(true);
    try {
      await onUpdateStatus(actionTicket.id, {
        status: targetStatus,
        note: actionNote,
        authorityName: currentUser?.name || 'Municipal Officer',
        department: assignedDept
      });
      setActionTicket(null);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (issueId) => {
    if (confirm(`Are you sure you want to dismiss and delete report ${issueId}?`)) {
      await onDeleteIssue(issueId);
    }
  };

  // KPI Calculations
  const total = issues.length;
  const criticalCount = issues.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const reportedPending = issues.filter(i => i.status === 'Reported').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Admin Header Banner */}
      <div className="p-6 bg-[#0c1427] rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              FixLocal Municipal Operations Gateway
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Central Authority & Ticket Triage Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-white">{currentUser?.name || 'Officer'}</strong> ({currentUser?.department || 'Municipal Administration'}, {currentUser?.ward || 'Citywide'})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onResetData}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
            title="Reset dataset to sample seed"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Admin KPI Quick Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0e172a] border border-cyan-500/20 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Awaiting Dispatch</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{reportedPending}</span>
          <span className="text-[10px] text-slate-400">New citizen filings</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e172a] border border-cyan-500/20 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active in Field</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">{inProgress}</span>
          <span className="text-[10px] text-slate-400">Crews currently deployed</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e172a] border border-cyan-500/20 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed / Closed</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{resolved}</span>
          <span className="text-[10px] text-slate-400">Signed-off resolutions</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e172a] border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
          <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">Critical Hazards</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">{criticalCount}</span>
          <span className="text-[10px] text-rose-400/80 font-bold">6h SLA Turnaround</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-[#0e172a] rounded-2xl border border-cyan-500/20 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID (e.g. ISS-1001), Title, Locality, or Citizen..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
          />
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950/80 border border-slate-700 text-xs text-slate-200 font-bold px-3 py-2 rounded-xl focus:border-cyan-400"
        >
          <option value="all">All Statuses</option>
          <option value="Reported">Reported</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        {/* Severity Filter */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="bg-slate-950/80 border border-slate-700 text-xs text-slate-200 font-bold px-3 py-2 rounded-xl focus:border-cyan-400"
        >
          <option value="all">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Main Issue Triage Table */}
      <div className="bg-[#0c1427] rounded-3xl border border-cyan-500/20 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Assigned Municipal Tickets ({filteredIssues.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Live Database Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Issue & Locality</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity / SLA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Upvotes</th>
                <th className="py-3 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
              {filteredIssues.map((issue) => {
                const statusMeta = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Reported'];
                const sevMeta = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG['Medium'];

                return (
                  <tr key={issue.id} className="hover:bg-slate-900/60 transition-colors">
                    
                    {/* Ticket ID */}
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {issue.id}
                    </td>

                    {/* Title & Locality */}
                    <td className="py-3 px-4 max-w-xs">
                      <span
                        onClick={() => onSelectIssue(issue)}
                        className="font-bold text-white hover:text-cyan-400 cursor-pointer block truncate"
                        title={issue.title}
                      >
                        {issue.title}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block">
                        📍 {issue.locality} ({issue.ward})
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-bold text-slate-300">
                        {issue.category}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                        {issue.suggestedDepartment}
                      </span>
                    </td>

                    {/* Severity & SLA */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${sevMeta.badgeClass}`}>
                        {issue.severity} ({issue.slaHours}h)
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusMeta.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusMeta.dotClass}`} />
                        {issue.status}
                      </span>
                    </td>

                    {/* Upvotes */}
                    <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      👍 {issue.upvotes}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* Dispatch / In Progress Action */}
                        {issue.status === 'Reported' && (
                          <button
                            onClick={() => handleOpenAction(issue, 'In Progress')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-all shadow-sm"
                            title="Dispatch field crew"
                          >
                            🚀 Dispatch
                          </button>
                        )}

                        {/* Resolve Action */}
                        {issue.status !== 'Resolved' && (
                          <button
                            onClick={() => handleOpenAction(issue, 'Resolved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all shadow-sm"
                            title="Mark as Resolved"
                          >
                            ✅ Resolve
                          </button>
                        )}

                        {/* Inspect full details */}
                        <button
                          onClick={() => onSelectIssue(issue)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Inspect timeline & photo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete / Dismiss */}
                        <button
                          onClick={() => handleDelete(issue.id)}
                          className="p-1 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-500/30 transition-colors"
                          title="Dismiss / Delete Ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Status Update Modal Popup */}
      {actionTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0c1427] border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Official Work Order Update
                </span>
                <h3 className="text-base font-black text-white">
                  {actionTicket.id}: Transition to "{targetStatus}"
                </h3>
              </div>
              <button
                onClick={() => setActionTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCommitAction} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Responsible Municipal Department
                </label>
                <input
                  type="text"
                  required
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Official Inspection & Dispatch Audit Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="e.g. Dispatched 4-person repair crew with cold mix asphalt..."
                  className="w-full text-xs p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionTicket(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition-all"
                >
                  {isSubmitting ? 'Committing...' : `Commit Status Update`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
