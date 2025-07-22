'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Target, 
  DollarSign,
  Quote,
  Star,
  Download,
  ArrowLeft,
  Home,
  MapPin,
  Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function WrappedPage({ params }) {
  const searchParams = useSearchParams();
  const snapshotId = searchParams.get('id');
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewRef, setPreviewRef] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [customization, setCustomization] = useState({
    primaryColor: '#9333EA', // purple-600
    secondaryColor: '#10B981', // green-500
    accentColor: '#3B82F6', // blue-600
    highlightColor: '#F59E0B', // orange-500
    fontFamily: 'Poppins'
  });

  const { orgId, month } = params;

  useEffect(() => {
    fetchSnapshot();
  }, [orgId, month, snapshotId]);

  useEffect(() => {
    // Load saved customization from localStorage
    const savedCustomization = localStorage.getItem('foundly-customization');
    if (savedCustomization) {
      try {
        const parsed = JSON.parse(savedCustomization);
        setCustomization(parsed);
      } catch (error) {
        console.error('Error loading customization:', error);
      }
    }
  }, []);

  const fetchSnapshot = async () => {
    try {
      if (snapshotId) {
        // Fetch by unique snapshot ID
        const response = await fetch(`/api/snapshots/${snapshotId}`);
        if (response.ok) {
          const snap = await response.json();
          setSnapshot(snap);
        } else {
          setError('Snapshot not found');
        }
        setLoading(false);
        return;
      }
      // Fallback: fetch by orgId/month (old behavior)
      const response = await fetch(`/api/snapshots?orgId=${orgId}`);
      if (response.ok) {
        const snapshots = await response.json();
        const monthSnapshots = snapshots
          .filter(s => s.month === month)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (monthSnapshots.length > 0) {
          setSnapshot(monthSnapshots[0]);
        } else {
          setError('Snapshot not found');
        }
      } else {
        setError('Failed to load snapshot');
      }
    } catch (error) {
      console.error('Error fetching snapshot:', error);
      setError('Failed to load snapshot');
    } finally {
      setLoading(false);
    }
  };





  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wrapped...</p>
        </div>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error || 'Snapshot not found'}</p>
          <Link href="/dashboard" className="btn-primary">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomize(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Customize
            </button>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-blue-700 text-sm">
              Screenshot from "This Month's Impact" section to share!
            </div>
          </div>
        </div>
      </nav>

      {/* Wrapped Content */}
      <div
        ref={setPreviewRef}
        className="bg-white pdf-export-container"
        style={{
          backgroundColor: '#ffffff',
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: customization.fontFamily
        }}
      >
        {/* Hero Section */}
        <div 
          className="text-white p-4 text-center flex-shrink-0"
          style={{ backgroundColor: customization.primaryColor }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
      >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-1">
                Foundly Wrapped
              </h1>
              
              <h2 className="text-lg font-bold mb-1">
                {snapshot.monthName} {snapshot.year}
              </h2>
              
              <div className="mb-2">
                <p className="text-sm font-semibold mb-1 text-white hero-org-name" style={{ color: '#FFFFFF' }}>
                  {snapshot.orgName || 'Your Organization'}
                </p>
                {snapshot.orgLocation && (
                  <div className="flex items-center justify-center gap-1 text-xs" style={{ color: '#FFFFFF' }}>
                    <MapPin className="w-3 h-3" style={{ color: '#FFFFFF' }} />
                    <span>{snapshot.orgLocation}</span>
                  </div>
                )}
              </div>

              {snapshot.orgVibe && (
                <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 mb-1 rounded-lg">
                  <span className="text-xs font-semibold">{snapshot.orgVibe}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="flex-1 py-2 px-3 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-3"
            >
              <h3 
                className="text-lg font-bold mb-1"
                style={{ color: customization.primaryColor }}
              >
                This Month's Impact
              </h3>
              <p className="text-sm text-gray-600">
                Here's what we accomplished together
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div 
                  className="w-14 h-14 flex items-center justify-center mx-auto mb-1 rounded-full"
                  style={{ backgroundColor: customization.primaryColor }}
                >
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h4 
                  className="text-xl font-bold mb-1"
                  style={{ color: customization.primaryColor }}
                >
                  {snapshot.hoursVolunteered.toLocaleString()}
                </h4>
                <p className="text-xs text-gray-600">Hours Volunteered</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div 
                  className="w-14 h-14 flex items-center justify-center mx-auto mb-1 rounded-full"
                  style={{ backgroundColor: customization.secondaryColor }}
                >
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h4 
                  className="text-xl font-bold mb-1"
                  style={{ color: customization.secondaryColor }}
                >
                  {snapshot.memberCount.toLocaleString()}
                </h4>
                <p className="text-xs text-gray-600">Active Members</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div 
                  className="w-14 h-14 flex items-center justify-center mx-auto mb-1 rounded-full"
                  style={{ backgroundColor: customization.accentColor }}
                >
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h4 
                  className="text-xl font-bold mb-1"
                  style={{ color: customization.accentColor }}
                >
                  {snapshot.eventCount.toLocaleString()}
                </h4>
                <p className="text-xs text-gray-600">Events Hosted</p>
              </motion.div>

              {snapshot.fundsRaised > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <div 
                    className="w-14 h-14 flex items-center justify-center mx-auto mb-1 rounded-full"
                    style={{ backgroundColor: customization.highlightColor }}
                  >
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <h4 
                    className="text-xl font-bold mb-1"
                    style={{ color: customization.highlightColor }}
                  >
                    ${snapshot.fundsRaised.toLocaleString()}
                  </h4>
                  <p className="text-xs text-gray-600">Funds Raised</p>
                </motion.div>
              )}
            </div>

            {/* Top Initiatives Section */}
            {snapshot.topInitiatives && snapshot.topInitiatives.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                className="mb-3"
              >
                <h3 
                  className="text-base font-bold text-center mb-2"
                  style={{ color: customization.primaryColor }}
                >
                  <Target 
                    className="w-4 h-4 inline mr-1" 
                    style={{ color: customization.secondaryColor }}
                  />
                  Top Initiatives This Month
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {snapshot.topInitiatives.map((initiative, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 p-2 border-l-4 rounded-lg"
                      style={{ borderLeftColor: customization.secondaryColor }}
                    >
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {initiative}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quote Section */}
            {snapshot.quoteOfTheMonth && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center mb-3"
              >
                <div className="max-w-4xl mx-auto">
                  <Quote 
                    className="w-6 h-6 mx-auto mb-1" 
                    style={{ color: customization.primaryColor }}
                  />
                  <blockquote 
                    className="text-base font-medium italic leading-relaxed"
                    style={{ color: customization.primaryColor }}
                  >
                    "{snapshot.quoteOfTheMonth}"
                  </blockquote>
                </div>
              </motion.div>
            )}

            {/* Highlights Section */}
            {snapshot.highlightBlurbs && snapshot.highlightBlurbs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mb-3"
              >
                <h3 
                  className="text-base font-bold text-center mb-2"
                  style={{ color: customization.primaryColor }}
                >
                  <Star 
                    className="w-4 h-4 inline mr-1" 
                    style={{ color: customization.secondaryColor }}
                  />
                  This Month's Highlights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {snapshot.highlightBlurbs.map((blurb, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 p-2 border-l-4 rounded-lg"
                      style={{ borderLeftColor: customization.primaryColor }}
                    >
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {blurb}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Advice Section */}
            {snapshot.adviceForOthers && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05 }}
                className="mb-3"
              >
                <h3 
                  className="text-base font-bold text-center mb-2"
                  style={{ color: customization.primaryColor }}
                >
                  <Quote 
                    className="w-4 h-4 inline mr-1" 
                    style={{ color: customization.highlightColor }}
                  />
                  Advice for Other Youth Organizations
                </h3>
                
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="bg-white border-2 border-gray-300 p-4 rounded-lg shadow-md"
                    style={{ borderLeftColor: customization.highlightColor, borderLeftWidth: '8px' }}
                  >
                    <p className="text-sm leading-relaxed italic font-semibold" style={{ color: '#1F2937' }}>
                      "{snapshot.adviceForOthers}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-center py-3 border-t border-gray-200 flex-shrink-0"
            >
              <h4 
                className="text-base font-bold mb-2"
                style={{ color: customization.primaryColor }}
              >
                Thank you for contributing to your community!
              </h4>
              <p className="text-gray-600 mb-2 text-xs">
                Made with Foundly Wrapped on {new Date().toLocaleDateString()}
              </p>
              <div 
                className="border rounded-lg p-2 mb-2"
                style={{ 
                  backgroundColor: `${customization.primaryColor}10`,
                  borderColor: `${customization.primaryColor}30`
                }}
              >
                <p 
                  className="text-xs font-medium mb-1"
                  style={{ color: customization.primaryColor }}
                >
                  Screenshot from "This Month's Impact" section to share your story
                </p>
                <p 
                  className="text-xs"
                  style={{ color: customization.primaryColor }}
                >
                  We encourage you to share this with your community!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Customize Your Wrapped</h3>
              <button
                onClick={() => setShowCustomize(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      primaryColor: e.target.value
                    })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.primaryColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      primaryColor: e.target.value
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="#9333EA"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.secondaryColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      secondaryColor: e.target.value
                    })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.secondaryColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      secondaryColor: e.target.value
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="#10B981"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.accentColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      accentColor: e.target.value
                    })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.accentColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      accentColor: e.target.value
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              {/* Highlight Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highlight Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customization.highlightColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      highlightColor: e.target.value
                    })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customization.highlightColor}
                    onChange={(e) => setCustomization({
                      ...customization,
                      highlightColor: e.target.value
                    })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="#F59E0B"
                  />
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={customization.fontFamily}
                  onChange={(e) => setCustomization({
                    ...customization,
                    fontFamily: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Poppins">Poppins (Default)</option>
                  <option value="Inter">Inter (Modern)</option>
                  <option value="Roboto">Roboto (Clean)</option>
                  <option value="Open Sans">Open Sans (Friendly)</option>
                  <option value="Montserrat">Montserrat (Elegant)</option>
                  <option value="Lato">Lato (Smooth)</option>
                  <option value="Nunito">Nunito (Rounded)</option>
                </select>
              </div>


            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCustomize(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save customization to localStorage or database
                  localStorage.setItem('foundly-customization', JSON.stringify(customization));
                  setShowCustomize(false);
                  toast.success('Customization saved!');
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
