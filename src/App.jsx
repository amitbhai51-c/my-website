import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import IssueCard from './components/IssueCard';
import IssueMap from './components/IssueMap';
import IssueDetailModal from './components/IssueDetailModal';
import ReportModal from './components/ReportModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AdminPortal from './components/AdminPortal';
import AuthModal from './components/AuthModal';
import QRCodeModal from './components/QRCodeModal';
import {
  fetchIssues,
  createIssue,
  toggleUpvote,
  updateIssueStatus,
  deleteIssue,
  fetchAnalytics,
  resetSampleData,
  getUserUpvotes,
  getStoredUser,
  clearAuthSession,
  verifyCurrentSession
} from './services/api';
import {
  Sparkles,
  Inbox,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'map' | 'analytics' | 'admin'
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userUpvotes, setUserUpvotes] = useState([]);

  // Auth state
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [qrModalData, setQrModalData] = useState({ isOpen: false, issue: null, isKiosk: false });

  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Verify session on mount
  useEffect(() => {
    verifyCurrentSession().then(u => {
      if (u) setCurrentUser(u);
    });
  }, []);

  // Initial Data Load
  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesRes, analyticsRes] = await Promise.all([
        fetchIssues({
          search: searchQuery,
          category: selectedCategory,
          status: selectedStatus,
          sort: sortBy
        }),
        fetchAnalytics()
      ]);
      setIssues(issuesRes);
      setAnalytics(analyticsRes);
      setUserUpvotes(getUserUpvotes());
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showToast('⚠️ Could not sync with API server. Operating in offline mode.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  // URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const issueId = params.get('issue');
    const reportQuick = params.get('report');

    if (reportQuick) {
      setIsReportModalOpen(true);
    } else if (issueId && issues.length > 0) {
      const found = issues.find(i => i.id === issueId);
      if (found) setSelectedIssue(found);
    }
  }, [issues]);

  // Auth Handlers
  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    showToast(message || `Logged in as ${user.name}`);
    if (user.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setCurrentUser(null);
    if (activeTab === 'admin') setActiveTab('feed');
    showToast('Logged out of account');
  };

  // Upvote Handler
  const handleUpvote = async (issueId) => {
    try {
      const userId = currentUser ? currentUser.id : 'usr_guest';
      setIssues(prev => prev.map(item => {
        if (item.id === issueId) {
          const hasVoted = userUpvotes.includes(issueId);
          return {
            ...item,
            upvotes: hasVoted ? Math.max(0, item.upvotes - 1) : item.upvotes + 1
          };
        }
        return item;
      }));

      const res = await toggleUpvote(issueId, userId);
      setUserUpvotes(getUserUpvotes());

      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => ({ ...prev, upvotes: res.upvotes }));
      }

      showToast(res.hasUpvoted ? '👍 Issue endorsed! Boosted in municipal priority feed.' : 'Removed endorsement.');
      fetchAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      showToast('Failed to register upvote');
    }
  };

  // Submit Issue Handler
  const handleSubmitIssue = async (newIssueData) => {
    const created = await createIssue(newIssueData);
    setIssues(prev => [created, ...prev]);
    showToast(`✅ Problem ${created.id} reported! AI assigned ${created.severity} severity.`);
    fetchAnalytics().then(setAnalytics).catch(() => {});
    setSelectedIssue(created);
  };

  // Update Status Handler (used by Admin Portal & Issue Detail Modal)
  const handleUpdateStatus = async (issueId, updateData) => {
    const updated = await updateIssueStatus(issueId, updateData);
    setIssues(prev => prev.map(i => i.id === issueId ? updated : i));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(updated);
    }
    showToast(`Updated ticket ${issueId} status to "${updated.status}"`);
    fetchAnalytics().then(setAnalytics).catch(() => {});
  };

  // Delete Issue Handler (Admin only)
  const handleDeleteIssue = async (issueId) => {
    try {
      await deleteIssue(issueId);
      setIssues(prev => prev.filter(i => i.id !== issueId));
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(null);
      }
      showToast(`🗑️ Ticket ${issueId} dismissed and removed.`);
      fetchAnalytics().then(setAnalytics).catch(() => {});
    } catch (err) {
      showToast('Failed to delete issue: ' + err.message);
    }
  };

  // Reset Data
  const handleResetData = async () => {
    if (confirm('Reset community issues dataset back to default demo records?')) {
      await resetSampleData();
      await loadData();
      showToast('Dataset reset to default state.');
    }
  };

  const unresolvedCount = useMemo(() => {
    return issues.filter(i => i.status !== 'Resolved').length;
  }, [issues]);

  return (
    <div className="min-h-screen flex flex-col bg-[#060b16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0c1427] text-white px-5 py-3.5 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.3)] border border-cyan-500/40 flex items-center space-x-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        unresolvedCount={unresolvedCount}
      />

      {/* Hero Banner with Stats, Search, and Filters (Shown on Feed & Map) */}
      {(activeTab === 'feed' || activeTab === 'map') && (
        <HeroBanner
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          stats={analytics?.summary || {}}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenKioskQR={() => setQrModalData({ isOpen: true, issue: null, isKiosk: true })}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: Issues Feed */}
        {activeTab === 'feed' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <span>Community Issue Registry</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-cyan-400 font-mono border border-cyan-500/30">
                    {issues.length} Active
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing civic tickets matching your active filters
                </p>
              </div>

              <button
                onClick={() => setActiveTab('map')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 transition-all shadow-[0_0_12px_rgba(0,240,255,0.15)]"
              >
                View on Live Map 🗺️
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-[#0c1427] rounded-3xl h-80 animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : issues.length === 0 ? (
              <div className="bg-[#0c1427] rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto my-8 shadow-inner">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No issues found</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  No civic problems match the current filter or search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStatus('all');
                  }}
                  className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-black rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map(issue => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onSelect={(iss) => setSelectedIssue(iss)}
                    onUpvote={handleUpvote}
                    onOpenQR={(iss) => setQrModalData({ isOpen: true, issue: iss, isKiosk: false })}
                    hasUpvoted={userUpvotes.includes(issue.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Interactive Map View */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  Interactive Locality Map
                </h2>
                <p className="text-xs text-slate-400">
                  Explore geo-tagged issues, pulsing critical hazards, and inspect markers
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
              >
                <span>Drop New Pin 📍</span>
              </button>
            </div>

            <IssueMap
              issues={issues}
              onSelectIssue={(iss) => setSelectedIssue(iss)}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
            />
          </div>
        )}

        {/* TAB 3: City Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            analytics={analytics}
            onResetData={handleResetData}
          />
        )}

        {/* TAB 4: Dedicated Admin Portal */}
        {activeTab === 'admin' && (
          <AdminPortal
            issues={issues}
            currentUser={currentUser}
            onUpdateStatus={handleUpdateStatus}
            onDeleteIssue={handleDeleteIssue}
            onSelectIssue={(iss) => setSelectedIssue(iss)}
            onResetData={handleResetData}
          />
        )}

      </main>

      {/* Cyber Neon Footer */}
      <footer className="bg-[#070d19] text-slate-400 text-xs py-8 border-t border-cyan-500/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-black text-white text-sm">
              Fix<span className="text-cyan-400">Local</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Decentralized Civic Problem Reporting, Tracking, and Municipal Accountability.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold">
            <button onClick={() => setActiveTab('feed')} className="hover:text-cyan-400 transition-colors">Issues Feed</button>
            <button onClick={() => setActiveTab('map')} className="hover:text-cyan-400 transition-colors">Live Map</button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-cyan-400 transition-colors">Analytics</button>
            {currentUser?.role === 'admin' && (
              <button onClick={() => setActiveTab('admin')} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Admin Portal
              </button>
            )}
            <button onClick={() => setQrModalData({ isOpen: true, issue: null, isKiosk: true })} className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Kiosk Poster QR
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitIssue={handleSubmitIssue}
        currentUser={currentUser}
      />

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpvote={handleUpvote}
        onOpenQR={(iss) => setQrModalData({ isOpen: true, issue: iss, isKiosk: false })}
        onUpdateStatus={handleUpdateStatus}
        hasUpvoted={selectedIssue ? userUpvotes.includes(selectedIssue.id) : false}
        currentUser={currentUser}
      />

      <QRCodeModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ isOpen: false, issue: null, isKiosk: false })}
        issue={qrModalData.issue}
        isKiosk={qrModalData.isKiosk}
      />

    </div>
  );
}
