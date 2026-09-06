import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Crosshair,
  Sparkles
} from 'lucide-react';
import { CATEGORIES, STATUS_CONFIG, SEVERITY_CONFIG } from '../utils/constants';

function createCustomPin(category, severity, isCritical) {
  const catObj = CATEGORIES.find(c => c.id === category);
  const color = catObj ? catObj.color : '#00f0ff';
  const pulseClass = isCritical ? 'pin-pulse-critical' : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="custom-civic-pin ${pulseClass}" style="
        width: 36px;
        height: 36px;
        background: #0c1427;
        border: 2.5px solid ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${color};
        box-shadow: 0 0 16px ${color}88, 0 4px 10px rgba(0,0,0,0.8);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
}

export default function IssueMap({
  issues = [],
  onSelectIssue,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [activePinCount, setActivePinCount] = useState(0);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const defaultCenter = [12.955, 77.62];
    const defaultZoom = 12;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
    });

    // Dark Matter tiles for cyberpunk aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const validIssues = issues.filter(
      i => typeof i.latitude === 'number' && typeof i.longitude === 'number' && !isNaN(i.latitude) && !isNaN(i.longitude)
    );

    setActivePinCount(validIssues.length);
    const bounds = L.latLngBounds();

    validIssues.forEach((issue) => {
      const isCritical = issue.severity === 'Critical' && issue.status !== 'Resolved';
      const icon = createCustomPin(issue.category, issue.severity, isCritical);
      const marker = L.marker([issue.latitude, issue.longitude], { icon });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; min-width: 240px; max-width: 280px; padding: 4px; background: #0c1427; color: #f8fafc; border-radius: 12px;">
          <div style="position: relative; border-radius: 8px; overflow: hidden; margin-bottom: 8px; height: 110px; background: #060b16;">
            <img src="${issue.imageUrl}" alt="${issue.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80'" />
            <span style="position: absolute; top: 6px; left: 6px; background: rgba(0, 0, 0, 0.85); color: #00f0ff; font-family: monospace; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; border: 1px solid rgba(0,240,255,0.4);">
              ${issue.id}
            </span>
            <span style="position: absolute; bottom: 6px; right: 6px; background: rgba(12,20,39,0.9); color: #fbbf24; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(251,191,36,0.3);">
              👍 ${issue.upvotes}
            </span>
          </div>

          <div style="margin-bottom: 6px; display: flex; gap: 4px; flex-wrap: wrap;">
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid #1e293b; background: #0f172a; color: #38bdf8;">
              ${issue.category}
            </span>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid #1e293b; ${issue.status === 'Resolved' ? 'background: #064e3b; color: #6ee7b7;' : issue.status === 'In Progress' ? 'background: #082f49; color: #7dd3fc;' : 'background: #451a03; color: #fcd34d;'}">
              ${issue.status}
            </span>
          </div>

          <h4 style="margin: 4px 0; font-size: 13px; font-weight: 800; color: #ffffff; line-height: 1.3;">
            ${issue.title}
          </h4>

          <p style="margin: 0 0 8px 0; font-size: 11px; color: #94a3b8; line-height: 1.3;">
            📍 ${issue.locality}
          </p>

          <button id="view-pin-${issue.id}" style="width: 100%; background: linear-gradient(to right, #00f0ff, #0284c7); color: #020617; font-size: 11px; font-weight: 900; padding: 7px 12px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>Inspect Full Details</span> →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300, className: 'dark-leaflet-popup' });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`view-pin-${issue.id}`);
          if (btn) {
            btn.onclick = () => onSelectIssue(issue);
          }
        }, 50);
      });

      markersLayer.addLayer(marker);
      bounds.extend([issue.latitude, issue.longitude]);
    });

    if (validIssues.length > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [issues, onSelectIssue]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current || issues.length === 0) return;
    const bounds = L.latLngBounds();
    issues.forEach(i => {
      if (i.latitude && i.longitude) bounds.extend([i.latitude, i.longitude]);
    });
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="relative w-full h-[650px] lg:h-[720px] rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-cyan-500/30 bg-[#070d19]">
      
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Overlays */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 max-w-sm">
        
        {/* Active Pins Badge */}
        <div className="bg-[#0c1427]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-bold text-white">
              {activePinCount} Civic Hotspots Plotted
            </span>
          </div>
          <button
            onClick={handleRecenter}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold ml-3 flex items-center"
            title="Recenter Map"
          >
            <Crosshair className="w-3.5 h-3.5 mr-1" /> Fit Map
          </button>
        </div>

        {/* Quick Filter Bar */}
        <div className="bg-[#0c1427]/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] border border-cyan-500/30 flex flex-col gap-2">
          <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
            <span>Filter Markers</span>
            <span className="text-slate-500">Live Pins</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {['all', 'Reported', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                  selectedStatus === st
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Map Category Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-[#0c1427]/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.6)] border border-cyan-500/30 hidden sm:block max-w-xs">
        <h5 className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center">
          <Layers className="w-3.5 h-3.5 mr-1.5 text-cyan-400" /> Map Categories
        </h5>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`flex items-center space-x-1.5 cursor-pointer py-0.5 px-1 rounded transition-colors ${
                selectedCategory === cat.id ? 'bg-cyan-950/60 font-bold text-cyan-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="truncate">{cat.label.split('&')[0]}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
