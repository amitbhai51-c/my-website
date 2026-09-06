import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  X,
  Camera,
  Upload,
  MapPin,
  Sparkles,
  ShieldCheck,
  EyeOff,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES, WARDS } from '../utils/constants';
import { SAMPLE_PHOTOS } from '../utils/samplePhotos';
import { analyzeReportAI } from '../services/api';

export default function ReportModal({ isOpen, onClose, onSubmitIssue, currentUser = null }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [locality, setLocality] = useState('Koramangala 4th Block');
  const [ward, setWard] = useState(currentUser?.ward || WARDS[0]);
  const [address, setAddress] = useState('Near 80 Feet Road Junction');
  const [lat, setLat] = useState(12.9352);
  const [lng, setLng] = useState(77.6245);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState(currentUser?.name || 'Rahul Sharma');
  const [reporterContact, setReporterContact] = useState(currentUser?.email || 'citizen@fixlocal.org');

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const miniMapRef = useRef(null);
  const miniMapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!miniMapRef.current) return;
    if (miniMapInstance.current) return;

    const map = L.map(miniMapRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: 'picker-pin',
      html: `
        <div style="width: 32px; height: 32px; background: #0c1427; border: 2.5px solid #00f0ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #00f0ff; box-shadow: 0 0 15px rgba(0,240,255,0.7);">
          📍
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const marker = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      setLat(Number(pos.lat.toFixed(5)));
      setLng(Number(pos.lng.toFixed(5)));
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setLat(Number(e.latlng.lat.toFixed(5)));
      setLng(Number(e.latlng.lng.toFixed(5)));
    });

    miniMapInstance.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      miniMapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (markerRef.current && miniMapInstance.current) {
      markerRef.current.setLatLng([lat, lng]);
      miniMapInstance.current.setView([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (description.length < 10) return;

    const timer = setTimeout(async () => {
      setIsAnalyzingAI(true);
      try {
        const result = await analyzeReportAI({
          title: title || 'Local civic issue',
          description,
          category,
          locality
        });
        setAiAnalysis(result);
      } catch (err) {
        console.warn('AI analysis skipped:', err);
      } finally {
        setIsAnalyzingAI(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [title, description, category, locality]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(Number(position.coords.latitude.toFixed(5)));
          setLng(Number(position.coords.longitude.toFixed(5)));
          setLocality('Current GPS Pin');
        },
        () => {
          const jLat = Number((12.95 + (Math.random() - 0.5) * 0.05).toFixed(5));
          const jLng = Number((77.60 + (Math.random() - 0.5) * 0.05).toFixed(5));
          setLat(jLat);
          setLng(jLng);
          setLocality('Simulated Geolocation');
        }
      );
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImageUrl(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        locality: locality.trim(),
        ward,
        address: address.trim(),
        latitude: lat,
        longitude: lng,
        imageUrl,
        isAnonymous,
        reportedBy: isAnonymous ? 'Anonymous Citizen' : (currentUser?.name || reporterName),
        userId: currentUser?.id,
        severity: aiAnalysis?.severity || 'Medium',
        severityScore: aiAnalysis?.severityScore || 65,
        priority: aiAnalysis?.priority || 'Medium',
        slaHours: aiAnalysis?.slaHours || 48,
        suggestedDepartment: aiAnalysis?.suggestedDepartment || 'Public Works Dept',
        aiSummary: aiAnalysis?.aiSummary || `${category} reported in ${locality}. Auto-dispatch logged.`
      };

      await onSubmitIssue(payload);
      onClose();
    } catch (err) {
      alert('Failed to submit issue: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0c1427] rounded-3xl shadow-[0_0_50px_rgba(0,240,255,0.25)] border border-cyan-500/40 overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#0c1427]/95 backdrop-blur-md border-b border-cyan-500/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center font-black shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-none">
                File a Civic Problem Report
              </h2>
              <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                Direct dispatch to FixLocal municipal emergency cells
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
          
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Problem Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    const matchedSample = SAMPLE_PHOTOS.find(p => p.category === cat.id);
                    if (matchedSample) setImageUrl(matchedSample.url);
                  }}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                    category === cat.id
                      ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'border-slate-800 hover:border-slate-700 text-slate-300 bg-[#0e172a]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hazardous pothole blocking bus transit corridor"
                className="w-full text-xs sm:text-sm font-semibold p-3 bg-[#070d19] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Detailed Hazard Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the location, safety impact, risk of accidents or water contamination..."
                className="w-full text-xs sm:text-sm p-3 bg-[#070d19] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
              />
            </div>
          </div>

          {/* Real-time AI Assistant Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1835] to-[#08152e] border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  FixLocal AI Severity Prediction Engine
                </span>
              </div>
              {isAnalyzingAI && (
                <span className="text-[10px] text-cyan-400 font-mono animate-pulse">
                  Analyzing text...
                </span>
              )}
            </div>

            {aiAnalysis ? (
              <div className="space-y-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                    aiAnalysis.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]' :
                    aiAnalysis.severity === 'High' ? 'bg-orange-950 text-orange-300 border-orange-500/60' :
                    'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                  }`}>
                    ⚠️ Predicted: {aiAnalysis.severity} Severity
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-cyan-400">
                    SLA: {aiAnalysis.slaHours}h Target
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 font-bold text-slate-300">
                    Dept: {aiAnalysis.suggestedDepartment}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 font-medium italic pt-1">
                  "{aiAnalysis.aiSummary}"
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Type your description above for automatic severity evaluation, SLA calculation, and municipal routing.
              </p>
            )}
          </div>

          {/* Photo Evidence */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Photo Evidence *
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-4 h-36 rounded-2xl overflow-hidden bg-black border border-slate-700 relative">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <div className="sm:col-span-8 space-y-2">
                <label className="flex items-center justify-center space-x-2 px-4 py-2.5 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl cursor-pointer bg-slate-900/60 hover:bg-cyan-950/20 transition-colors">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-300">Upload Image from Disk / Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Or select pre-verified sample photo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_PHOTOS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageUrl(p.url)}
                        className={`text-[10px] px-2 py-1 rounded-lg border font-medium transition-all ${
                          imageUrl === p.url
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Pin Location on Map *
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Use Current Location</span>
              </button>
            </div>

            <div className="h-44 w-full rounded-2xl overflow-hidden border border-cyan-500/30 relative">
              <div ref={miniMapRef} className="w-full h-full" />
              <div className="absolute bottom-2 left-2 z-[400] bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/30">
                Lat: {lat} | Lng: {lng} (Click / drag pin)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Locality</label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-white focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Ward Selection</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-white focus:border-cyan-400"
                >
                  {WARDS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Specific Landmark / Street Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-[#070d19] border border-slate-700 rounded-xl text-white focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Privacy & Anonymous Reporting */}
          <div className="p-4 rounded-2xl bg-[#0e172a] border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Citizen Privacy & Anonymous Filing
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Optionally hide your identity on public reports
                  </span>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {isAnonymous ? (
              <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/30 flex items-center space-x-2 text-xs text-cyan-300 font-medium">
                <EyeOff className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Anonymous Mode Active: Your name and contact will be kept strictly private.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Reporter Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Contact Email/Phone</label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>{isSubmitting ? 'Registering Problem...' : 'Submit Civic Report'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
