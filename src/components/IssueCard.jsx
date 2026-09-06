import React from 'react';
import {
  MapPin,
  ThumbsUp,
  Clock,
  QrCode,
  Sparkles,
  ChevronRight,
  User,
  EyeOff
} from 'lucide-react';
import { STATUS_CONFIG, SEVERITY_CONFIG, CATEGORIES } from '../utils/constants';

export default function IssueCard({
  issue,
  onSelect,
  onUpvote,
  onOpenQR,
  hasUpvoted = false
}) {
  const statusInfo = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Reported'];
  const severityInfo = SEVERITY_CONFIG[issue.severity] || SEVERITY_CONFIG['Medium'];
  const categoryInfo = CATEGORIES.find(c => c.id === issue.category);

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="group bg-[#0c1427] rounded-3xl border border-slate-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
      
      {/* Top Media Banner */}
      <div>
        <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1427] via-transparent to-black/40" />

          {/* Issue ID and Severity Tag */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-cyan-400 font-mono text-[11px] font-bold border border-cyan-500/30">
              {issue.id}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${severityInfo.badgeClass}`}>
              {issue.severity}
            </span>
          </div>

          {/* QR Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQR(issue);
            }}
            title="Generate QR code for this issue"
            className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-slate-300 hover:text-cyan-400 border border-slate-700 shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Category Chip */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold bg-black/80 text-white shadow-sm backdrop-blur-sm border border-slate-700">
              <span
                className="w-2 h-2 rounded-full mr-1.5 shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: categoryInfo?.color || '#00f0ff' }}
              />
              {issue.category}
            </span>
          </div>

          {/* Status Indicator Pill */}
          <div className="absolute bottom-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold border ${statusInfo.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dotClass}`} />
              {issue.status}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Location & Time */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center text-cyan-400 font-bold truncate max-w-[200px]" title={issue.locality}>
              <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1 flex-shrink-0" />
              {issue.locality}
            </span>
            <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">{formatDate(issue.reportedAt)}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(issue)}
            className="text-base font-black text-white group-hover:text-cyan-400 cursor-pointer line-clamp-2 transition-colors mb-2 leading-snug"
          >
            {issue.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {issue.description}
          </p>

          {/* AI Municipal Summary Pill */}
          {issue.aiSummary && (
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 mb-3 shadow-inner">
              <div className="flex items-center space-x-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400 mb-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>FixLocal AI Dispatch Analysis</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium line-clamp-2 leading-relaxed">
                {issue.aiSummary}
              </p>
            </div>
          )}

          {/* Reporter info */}
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            {issue.isAnonymous ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
                <span className="italic text-slate-400">Anonymous Citizen</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{issue.reportedBy}</span>
              </>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[10px]">{issue.ward}</span>
          </div>
        </div>
      </div>

      {/* Footer: Upvote Button & View Details */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
          
          {/* Upvote / Endorse CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(issue.id);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
              hasUpvoted
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
            <span>{hasUpvoted ? 'Endorsed' : 'Affects Me'}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
              hasUpvoted ? 'bg-black text-amber-400' : 'bg-slate-800 text-slate-300'
            }`}>
              {issue.upvotes}
            </span>
          </button>

          {/* Details CTA */}
          <button
            onClick={() => onSelect(issue)}
            className="flex items-center space-x-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 px-3 py-2 rounded-xl hover:bg-cyan-950/40 transition-colors"
          >
            <span>Timeline</span>
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
}
