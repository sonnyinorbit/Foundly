'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Plus,
  ArrowRight,
  Download,
  Eye,
  Edit3,
  CheckCircle,
  Star,
  Target,
  TrendingUp,
  Heart,
  Play,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import WrappedForm from '../components/WrappedForm';
import WrappedPreview from '../components/WrappedPreview';
import { getRandomPrompt, getRandomTheme } from '../../lib/prompts';

export default function Dashboard() {
  const [snapshots, setSnapshots] = useState([]);
  const [currentSnapshot, setCurrentSnapshot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    orgId: 'demo-org-123', // For demo purposes
    orgName: '',
    orgLocation: '',
    orgDescription: '',
    month: '',
    hoursVolunteered: 0,
    memberCount: 0,
    eventCount: 0,
    fundsRaised: 0,
    orgVibe: '',
    quoteOfTheMonth: '',
    highlightBlurbs: [''],
    topInitiatives: [''],
    adviceForOthers: '',
    theme: 'sunset'
  });

  // Generate consistent color based on org name
  const getOrgColor = (orgName) => {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
      '#98D8C8', // Mint
      '#F7DC6F', // Gold
      '#BB8FCE', // Purple
      '#85C1E9', // Sky Blue
    ];
    
    if (!orgName) return colors[0];
    
    // Simple hash function to get consistent color for same org name
    let hash = 0;
    for (let i = 0; i < orgName.length; i++) {
      hash = orgName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Demo org data
  const demoOrg = {
    name: "Youth Action Collective",
    description: "Empowering young leaders to create positive change in their communities"
  };

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    try {
      const response = await fetch(`/api/snapshots?orgId=${formData.orgId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched snapshots:', data);
        setSnapshots(data);
      }
    } catch (error) {
      console.error('Error fetching snapshots:', error);
      toast.error('Failed to load snapshots');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    
    setFormData({
      ...formData,
      month: `${year}-${month}`,
      theme: getRandomTheme()
    });
    setShowForm(true);
    setShowPreview(false);
  };

  const handleSaveSnapshot = async (data) => {
    try {
      console.log('Attempting to save snapshot with data:', data);
      
      const response = await fetch('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const savedSnapshot = await response.json();
        console.log('Snapshot saved successfully:', savedSnapshot);
        setSnapshots([savedSnapshot, ...snapshots]);
        setCurrentSnapshot(savedSnapshot);
        setShowForm(false);
        setShowPreview(true);
        toast.success('Snapshot saved successfully!');
      } else {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        toast.error(errorData.error || 'Failed to save snapshot');
      }
    } catch (error) {
      console.error('Error saving snapshot:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else if (error.message.includes('MONGODB_URI')) {
        toast.error('Database connection issue. Please contact support.');
      } else {
        toast.error('Failed to save snapshot. Please try again.');
      }
    }
  };

  const handleDeleteSnapshot = async (snapshotId) => {
    if (!confirm('Are you sure you want to delete this snapshot? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Attempting to delete snapshot:', snapshotId);
      
      const response = await fetch(`/api/snapshots/${snapshotId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('Snapshot deleted successfully');
        setSnapshots(snapshots.filter(s => s._id !== snapshotId));
        toast.success('Snapshot deleted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Delete error response:', errorData);
        toast.error(errorData.error || 'Failed to delete snapshot');
      }
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      toast.error('Failed to delete snapshot. Please try again.');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-[#4A5568]">Loading your impact stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header/Navigation */}
        <div className="bg-[#FFFBF5] rounded-3xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1A202C]">
                Foundly Wrapped
              </h1>
            </div>
            

            
            {/* User Profile & CTA */}
            <div className="flex items-center gap-4">
                      <button
          onClick={handleCreateNew}
          className="bg-[#E53E3E] hover:bg-[#C53030] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Start Creating
        </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-[#1A202C] mb-4">
                    Share Your Impact Story
                  </h2>
                  <p className="text-lg text-[#4A5568] mb-6">
                    Create beautiful monthly snapshots to showcase your organization's amazing work 
                    and inspire others in the community.
                  </p>
                  <button
                    onClick={handleCreateNew}
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                    <ArrowRight className="w-5 h-5" />
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative">
                  <div className="w-48 h-48 bg-[#FF6B6B] rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white text-8xl font-bold drop-shadow-lg">F</span>
                  </div>
                </div>
              </div>
            </motion.div>



            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-2xl font-bold text-[#1A202C] mb-6">Community Impact This Year</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-card">
                  <div className="text-[#FF6B6B] mb-2">
                    <Calendar className="w-8 h-8 mx-auto" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1A202C]">
                    {snapshots.length}
                  </h4>
                  <p className="text-[#4A5568]">Monthly Snapshots</p>
                </div>

                <div className="stat-card">
                  <div className="text-[#4ECDC4] mb-2">
                    <Users className="w-8 h-8 mx-auto" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1A202C]">
                    {snapshots.reduce((sum, s) => sum + s.memberCount, 0)}
                  </h4>
                  <p className="text-[#4A5568]">Total Members</p>
                  <p className="text-xs text-[#A0AEC0] mt-1">Sum across all months</p>
                </div>

                <div className="stat-card">
                  <div className="text-[#FFD633] mb-2">
                    <Target className="w-8 h-8 mx-auto" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1A202C]">
                    {snapshots.reduce((sum, s) => sum + s.hoursVolunteered, 0)}
                  </h4>
                  <p className="text-[#4A5568]">Hours Volunteered</p>
                </div>

                <div className="stat-card">
                  <div className="text-[#A8E6CF] mb-2">
                    <Star className="w-8 h-8 mx-auto" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#1A202C]">
                    {snapshots.reduce((sum, s) => sum + s.eventCount, 0)}
                  </h4>
                  <p className="text-[#4A5568]">Events Hosted</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Community Snapshots */}
            {snapshots.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h3 className="text-2xl font-bold text-[#1A202C] mb-6">Recent Community Snapshots</h3>
                <div className="grid gap-4">
                  {snapshots.slice(0, 3).map((snapshot, index) => (
                    <div
                      key={snapshot._id}
                      className="lesson-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div 
                              className="w-12 h-12 rounded-xl border-2 border-gray-200"
                              style={{ backgroundColor: getOrgColor(snapshot.orgName) }}
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#1A202C]">
                              {snapshot.orgName || 'Your Organization'}
                              {snapshot.orgLocation && ` | ${snapshot.orgLocation}`}
                            </h4>
                            <p className="text-sm text-[#718096]">
                              {snapshot.monthName} {snapshot.year} Recap
                            </p>
                            <p className="text-xs text-[#718096] mt-1">
                              {snapshot.hoursVolunteered} hours • {snapshot.memberCount} members
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/wrapped/${snapshot.orgId}/${snapshot.month}?id=${snapshot._id}`}
                            className="p-2 text-[#718096] hover:text-[#1A202C] transition-colors"
                            title="View snapshot"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {snapshots.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card text-center"
              >
                <div className="w-24 h-24 rounded-3xl border-2 border-gray-200 mx-auto mb-6" style={{ backgroundColor: '#FF6B6B' }} />
                <h3 className="text-2xl font-bold text-[#1A202C] mb-4">
                  Ready to share your impact?
                </h3>
                <p className="text-[#4A5568] mb-6 max-w-md mx-auto">
                  Create your first monthly impact snapshot and start showcasing your organization's amazing work to your community.
                </p>
                <button
                  onClick={handleCreateNew}
                  className="btn-secondary"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Wrapped
                </button>
              </motion.div>
            )}
          </div>

                    {/* Sidebar */}
          <div className="space-y-6">
            {/* What is Foundly Wrapped */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sidebar-card"
            >
              <h3 className="text-xl font-bold text-[#1A202C] mb-4">What is Foundly Wrapped?</h3>
              
              <ul className="space-y-2 text-sm text-[#4A5568]">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6B6B] mt-1">•</span>
                  <span>Track your org's growth & progress over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6B6B] mt-1">•</span>
                  <span>Make shareable updates for socials, newsletters, websites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6B6B] mt-1">•</span>
                  <span>Boost transparency for grants, donors, and partnerships</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6B6B] mt-1">•</span>
                  <span>See what other youth-led orgs are doing too and get inspired</span>
                </li>
              </ul>
            </motion.div>

            {/* How It Works */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-[#1A202C] mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-[#F7FAFC]">
                  <h4 className="font-semibold text-[#1A202C] text-sm mb-2">Track Your Progress</h4>
                  <p className="text-xs text-[#4A5568]">
                    Record your monthly activities, volunteer hours, and member engagement
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-[#F7FAFC]">
                  <h4 className="font-semibold text-[#1A202C] text-sm mb-2">Easy Sharing</h4>
                  <p className="text-xs text-[#4A5568]">
                    Simply screenshot and share on social media, websites, or with your community
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Eye Button Kanban Card (moved below How It Works) */}
            <div className="bg-yellow-50 border-l-4 border-yellow-300 rounded-2xl p-5 shadow flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-yellow-800">Tip</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-900 text-sm">
                For a prettier and customizable Wrapped, click the
                <span className="inline-flex items-center"><svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 mx-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M1.5 12S5.25 5.25 12 5.25 22.5 12 22.5 12 18.75 18.75 12 18.75 1.5 12 1.5 12z' /><circle cx='12' cy='12' r='3' /></svg> eye</span> button on your snapshot!
              </div>
              <div className="text-xs text-yellow-700 mt-1">You can further customize and share your Wrapped from there.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#FFFBF5] rounded-3xl p-6 border border-[#F7FAFC] text-center">
            <p className="text-sm text-[#4A5568]">
              This is a student project created for educational purposes. 
              <br />
              No liability is assumed for any data loss, privacy issues, or content shared through this platform.
              <br />
              Users are responsible for their own data and understand that content may be publicly accessible.
            </p>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <WrappedForm
          formData={formData}
          setFormData={setFormData}
          onSave={handleSaveSnapshot}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Preview Modal */}
      {showPreview && currentSnapshot && (
        <div>
          <div className="bg-blue-100 border-l-4 border-blue-400 text-blue-800 p-4 rounded-t-xl text-center text-sm font-medium">
            Snapshot created!<br />
            <span>For a prettier and customizable Wrapped, close this window and click the <span className="inline-flex items-center"><Eye className="inline w-4 h-4 mx-1" /> eye</span> button on your snapshot in the dashboard!</span>
          </div>
          <WrappedPreview
            snapshot={currentSnapshot}
            onClose={() => setShowPreview(false)}
          />
        </div>
      )}
    </div>
  );
} 