import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ThumbsUp,
  QrCode,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Send,
  Navigation,
  EyeOff,
  User
} from 'lucide-react';
import { STATUS_CONFIG, SEVERITY_CONFIG, CATEGORIES } from '../utils/constants';

export default function IssueDetailModal({
  issue,
  onClose,
  onUpvote,
  onOpenQR,
  onUpdateStatus,
  hasUpvoted = false,
  currentUser = null
}) {
  if (!issue) return null;

  const isAdmin = currentUser?.role === 'admin';
  const [newStatus, setNewStatus] = useState(issue.status);
  const [authorityNote, setAuthorityNote] = useState('');
  const [authorityOfficer, setAuthorityOfficer] = useState(currentUser?.name || 'Chief Municipal Officer');
  const [assignedDept, setAssignedDept] = useState(issue.suggestedDepartment || currentUser?.department || 'Public Works Dept');
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  const statusInfo = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Reported'];
  const severityInfo = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG['Medium'];
  const categoryInfo = CATEGORIES.find(c => c.id === issue.category);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!authorityNote.trim()) {
      alert('Please enter an official inspection or dispatch remark.');
      return;
    }
    setIsSubmittingStatus(true);
    try {
      await onUpdateStatus(issue.id, {
        status: newStatus,
        note: authorityNote.trim(),
        authorityName: authorityOfficer,
        department: assignedDept
      });
      setAuthorityNote('');
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const formatTimelineDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c1427] rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.2)] border border-cyan-500/40 overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0c1427]/95 backdrop-blur-md border-b border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/40">
              {issue.id}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${statusInfo.badgeClass}`}>
              {issue.status}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${severityInfo.badgeClass}`}>
              {issue.severity} Priority
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenQR(issue)}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
              title="View QR Code"
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Top Banner: Photo + Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Photo */}
            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-slate-700 bg-black relative h-64 md:h-72">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl text-white text-[11px] flex items-center justify-between border border-white/10">
                <span className="flex items-center truncate text-cyan-400">
                  <Navigation className="w-3 h-3 text-cyan-400 mr-1 flex-shrink-0" />
                  {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">GPS Verified</span>
              </div>
            </div>

            {/* Core Info */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1.5 font-medium">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: categoryInfo?.color || '#00f0ff' }}
                  />
                  <span className="font-bold text-white">{issue.category}</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-mono">{issue.ward}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
                  {issue.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Address */}
              <div className="p-3 bg-[#0e172a] rounded-2xl border border-cyan-500/20 flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">{issue.locality}</span>
                  <span className="text-slate-400">{issue.address}</span>
                </div>
              </div>

              {/* Endorse / Upvote CTA */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => onUpvote(issue.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md ${
                    hasUpvoted
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
                  <span>{hasUpvoted ? 'Endorsed by You' : 'Affects Me Too / Upvote'}</span>
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-black/30 font-mono text-xs">
                    {issue.upvotes}
                  </span>
                </button>

                <button
                  onClick={() => onOpenQR(issue)}
                  className="px-4 py-3 rounded-xl border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 font-bold text-xs flex items-center space-x-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">QR Code</span>
                </button>
              </div>

            </div>

          </div>

          {/* AI Civic Intelligence Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a1835] to-[#07132a] border border-cyan-500/30 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                  ⚡
                </div>
                <h4 className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wide">
                  FixLocal AI Municipal Routing Analysis
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/40">
                SLA: {issue.slaHours || 24}h Turnaround
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed mb-3">
              {issue.aiSummary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-cyan-500/20 text-xs">
              <div>
                <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold block">Assigned Dept</span>
                <span className="font-bold text-white">{issue.suggestedDepartment}</span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold block">Hazard Index</span>
                <span className="font-bold text-rose-400 font-mono">{issue.severityScore || 75} / 100</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold block">Citizen Confidentiality</span>
                <span className="font-semibold text-slate-300">
                  {issue.isAnonymous ? '🛡️ Anonymous Citizen' : `👤 ${issue.reportedBy}`}
                </span>
              </div>
            </div>
          </div>

          {/* Status Progression & Timeline Audit Trail */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Status Progression & Timeline Audit Trail</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {issue.timeline?.length || 1} Events Logged
              </span>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#0e172a] rounded-2xl border border-slate-800 text-center">
              {['Reported', 'In Progress', 'Resolved'].map((step, idx) => {
                const isCurrent = issue.status === step;
                const isPassed = 
                  (step === 'Reported') ||
                  (step === 'In Progress' && (issue.status === 'In Progress' || issue.status === 'Resolved')) ||
                  (step === 'Resolved' && issue.status === 'Resolved');

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all ${
                      isCurrent
                        ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                        : isPassed
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-xs font-bold ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timeline Events */}
            <div className="relative pl-6 border-l-2 border-cyan-500/30 space-y-4 ml-3 pt-2">
              {issue.timeline && issue.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#0c1427] ring-2 ring-cyan-500/40" />
                  
                  <div className="bg-[#0e172a] p-3.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white">
                        {event.author || 'Municipal System'}
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        {formatTimelineDate(event.timestamp)}
                      </span>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold mb-1.5 ${
                      event.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      event.status === 'In Progress' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {event.status}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {event.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Municipal Authority Action Console (Unlocked if logged in as Admin) */}
          {isAdmin && (
            <div className="p-5 rounded-2xl bg-[#0e1b33] border-2 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] space-y-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-wide">
                  Municipal Authority Management Console
                </h4>
              </div>

              <form onSubmit={handleStatusSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-cyan-400"
                    >
                      <option value="Reported">Reported</option>
                      <option value="In Progress">In Progress (Field Dispatched)</option>
                      <option value="Resolved">Resolved (Work Completed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Officer Role / Name</label>
                    <input
                      type="text"
                      value={authorityOfficer}
                      onChange={(e) => setAuthorityOfficer(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Assigned Department</label>
                    <input
                      type="text"
                      value={assignedDept}
                      onChange={(e) => setAssignedDept(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Official Work Order / Inspection Remark *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={authorityNote}
                    onChange={(e) => setAuthorityNote(e.target.value)}
                    placeholder="e.g., Crew dispatched with asphalt batch. Surface sealed and traffic cones removed."
                    className="w-full text-xs font-medium p-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingStatus}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingStatus ? 'Logging Status...' : 'Commit Status Update'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
