export const CATEGORIES = [
  { id: 'Roads & Infrastructure', label: 'Roads & Infrastructure', color: '#00f0ff', icon: 'Construction' },
  { id: 'Water Supply & Drainage', label: 'Water Supply & Drainage', color: '#38bdf8', icon: 'Droplets' },
  { id: 'Streetlights & Electricity', label: 'Streetlights & Electricity', color: '#fbbf24', icon: 'Zap' },
  { id: 'Garbage & Sanitation', label: 'Garbage & Sanitation', color: '#10b981', icon: 'Trash2' },
  { id: 'Public Safety', label: 'Public Safety', color: '#f43f5e', icon: 'ShieldAlert' },
  { id: 'Parks & Public Infrastructure', label: 'Parks & Public Infrastructure', color: '#a855f7', icon: 'Trees' },
];

export const STATUS_CONFIG = {
  'Reported': {
    label: 'Reported',
    badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
    dotClass: 'bg-amber-400',
    stepNumber: 1
  },
  'In Progress': {
    label: 'In Progress',
    badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]',
    dotClass: 'bg-cyan-400',
    stepNumber: 2
  },
  'Resolved': {
    label: 'Resolved',
    badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    dotClass: 'bg-emerald-400',
    stepNumber: 3
  }
};

export const SEVERITY_CONFIG = {
  'Critical': {
    label: 'Critical',
    badgeClass: 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]',
    dotClass: 'bg-rose-500',
    sla: '6h SLA',
    icon: 'AlertOctagon'
  },
  'High': {
    label: 'High',
    badgeClass: 'bg-orange-950/90 text-orange-300 border-orange-500/60 shadow-[0_0_10px_rgba(249,115,22,0.3)]',
    dotClass: 'bg-orange-400',
    sla: '24h SLA',
    icon: 'AlertTriangle'
  },
  'Medium': {
    label: 'Medium',
    badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]',
    dotClass: 'bg-cyan-400',
    sla: '72h SLA',
    icon: 'AlertCircle'
  },
  'Low': {
    label: 'Low',
    badgeClass: 'bg-slate-900 text-slate-300 border-slate-700',
    dotClass: 'bg-slate-400',
    sla: '120h SLA',
    icon: 'Info'
  }
};

export const WARDS = [
  'Ward 151 (Koramangala)',
  'Ward 112 (Indiranagar)',
  'Ward 168 (Jayanagar)',
  'Ward 174 (HSR Layout)',
  'Ward 65 (Malleshwaram)',
  'Ward 84 (Whitefield)',
  'Ward 35 (Sadashivanagar)',
  'Ward 42 (Shivajinagar)'
];
