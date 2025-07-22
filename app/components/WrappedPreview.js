'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Download, 
  Users, 
  Calendar, 
  Target, 
  DollarSign,
  Quote,
  Star,
  MapPin,
  Palette,
  Type,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WrappedPreview({ snapshot, onClose }) {

  const [showCustomization, setShowCustomization] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#8B5CF6', // Soft purple
    secondary: '#10B981', // Soft green
    background: '#FAFAFA',
    text: '#374151'
  });
  const [customFont, setCustomFont] = useState('Inter');
  const previewRef = useRef(null);

  const fontOptions = [
    { name: 'Inter', value: 'Inter', className: 'font-inter' },
    { name: 'Poppins', value: 'Poppins', className: 'font-poppins' },
    { name: 'Roboto', value: 'Roboto', className: 'font-roboto' },
    { name: 'Open Sans', value: 'Open Sans', className: 'font-open-sans' },
    { name: 'Lato', value: 'Lato', className: 'font-lato' },
    { name: 'Montserrat', value: 'Montserrat', className: 'font-montserrat' },
    { name: 'Nunito', value: 'Nunito', className: 'font-nunito' }
  ];

  const colorPresets = [
    { name: 'Soft Purple', primary: '#8B5CF6', secondary: '#10B981' },
    { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#06B6D4' },
    { name: 'Warm Sunset', primary: '#F59E0B', secondary: '#EF4444' },
    { name: 'Forest Green', primary: '#059669', secondary: '#84CC16' },
    { name: 'Rose Pink', primary: '#EC4899', secondary: '#F97316' },
    { name: 'Slate Gray', primary: '#64748B', secondary: '#94A3B8' }
  ];



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white max-w-6xl w-full max-h-[95vh] overflow-hidden rounded-3xl"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Monthly Wrapped
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Palette className="w-4 h-4" />
              Customize
            </button>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-blue-700 text-sm">
              💡 Take a screenshot to save your wrapped!
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Customization Panel */}
        {showCustomization && (
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="space-y-6">
              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Color Presets:</label>
                <div className="grid grid-cols-3 gap-3">
                  {colorPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomColors(prev => ({ ...prev, primary: preset.primary, secondary: preset.secondary }))}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                    >
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Primary Color:</label>
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => setCustomColors(prev => ({ ...prev, primary: e.target.value }))}
                    className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Secondary Color:</label>
                  <input
                    type="color"
                    value={customColors.secondary}
                    onChange={(e) => setCustomColors(prev => ({ ...prev, secondary: e.target.value }))}
                    className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              </div>

              {/* Font Selection */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Font:</label>
                <select
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Preview Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
          <div 
            ref={previewRef} 
            className={`bg-white min-h-screen pdf-export-container ${fontOptions.find(f => f.value === customFont)?.className || 'font-inter'}`}
            style={{ 
              backgroundColor: '#ffffff'
            }}
          >
            {/* Hero Section */}
            <div 
              className="text-white p-12 text-center"
              style={{ backgroundColor: customColors.primary }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-5xl font-bold mb-6">
                    Foundly Wrapped
                  </h1>
                  
                  <h2 className="text-3xl font-bold mb-4">
                    {snapshot.monthName} {snapshot.year}
                  </h2>
                  
                  <div className="mb-8">
                    <p className="text-xl text-white font-semibold mb-2 hero-org-name" style={{ color: '#FFFFFF' }}>
                      {snapshot.orgName || 'Your Organization'}
                    </p>
                    {snapshot.orgLocation && (
                      <div className="flex items-center justify-center gap-1 text-lg text-white">
                        <MapPin className="w-4 h-4" />
                        <span>{snapshot.orgLocation}</span>
                      </div>
                    )}
                  </div>

                  {snapshot.orgVibe && (
                    <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 mb-6 rounded-lg">
                      <span className="text-lg font-semibold">{snapshot.orgVibe}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Stats Section */}
            <div className="py-16 px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-16"
              >
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: customColors.primary }}
                >
                  This Month's Impact
                </h3>
                <p className="text-xl text-gray-600">
                  Here's what we accomplished together
                </p>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div 
                    className="w-24 h-24 flex items-center justify-center mx-auto mb-4 rounded-full"
                    style={{ backgroundColor: customColors.primary }}
                  >
                    <Target className="w-12 h-12 text-white" />
                  </div>
                  <h4 
                    className="text-4xl font-bold mb-2"
                    style={{ color: customColors.primary }}
                  >
                    {snapshot.hoursVolunteered.toLocaleString()}
                  </h4>
                  <p className="text-lg text-gray-600">Hours Volunteered</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div 
                    className="w-24 h-24 flex items-center justify-center mx-auto mb-4 rounded-full"
                    style={{ backgroundColor: customColors.secondary }}
                  >
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h4 
                    className="text-4xl font-bold mb-2"
                    style={{ color: customColors.secondary }}
                  >
                    {snapshot.memberCount.toLocaleString()}
                  </h4>
                  <p className="text-lg text-gray-600">Active Members</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <div 
                    className="w-24 h-24 flex items-center justify-center mx-auto mb-4 rounded-full"
                    style={{ backgroundColor: customColors.primary }}
                  >
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                  <h4 
                    className="text-4xl font-bold mb-2"
                    style={{ color: customColors.primary }}
                  >
                    {snapshot.eventCount.toLocaleString()}
                  </h4>
                  <p className="text-lg text-gray-600">Events Hosted</p>
                </motion.div>

                {snapshot.fundsRaised > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                  >
                    <div 
                      className="w-24 h-24 flex items-center justify-center mx-auto mb-4 rounded-full"
                      style={{ backgroundColor: customColors.secondary }}
                    >
                      <DollarSign className="w-12 h-12 text-white" />
                    </div>
                    <h4 
                      className="text-4xl font-bold mb-2"
                      style={{ color: customColors.secondary }}
                    >
                      ${snapshot.fundsRaised.toLocaleString()}
                    </h4>
                    <p className="text-lg text-gray-600">Funds Raised</p>
                  </motion.div>
                )}
              </div>

              {/* Top Initiatives Section */}
              {snapshot.topInitiatives && snapshot.topInitiatives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  className="mb-16"
                >
                  <h3 
                    className="text-2xl font-bold text-center mb-8"
                    style={{ color: customColors.primary }}
                  >
                    <Target 
                      className="w-6 h-6 inline mr-2" 
                      style={{ color: customColors.secondary }}
                    />
                    Top Initiatives This Month
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {snapshot.topInitiatives.map((initiative, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 p-4 border-l-4 rounded-lg"
                        style={{ borderLeftColor: customColors.secondary }}
                      >
                        <p className="text-base text-gray-700 leading-relaxed">
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
                  className="text-center mb-16"
                >
                  <div className="max-w-4xl mx-auto">
                    <Quote 
                      className="w-16 h-16 mx-auto mb-6" 
                      style={{ color: customColors.primary }}
                    />
                    <blockquote 
                      className="text-2xl font-medium italic leading-relaxed"
                      style={{ color: customColors.primary }}
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
                  className="mb-16"
                >
                  <h3 
                    className="text-2xl font-bold text-center mb-8"
                    style={{ color: customColors.primary }}
                  >
                    <Star 
                      className="w-6 h-6 inline mr-2" 
                      style={{ color: customColors.secondary }}
                    />
                    This Month's Highlights
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {snapshot.highlightBlurbs.map((blurb, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 p-4 border-l-4 rounded-lg"
                        style={{ borderLeftColor: customColors.primary }}
                      >
                        <p className="text-base text-gray-700 leading-relaxed">
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
                  className="mb-16"
                >
                  <h3 
                    className="text-2xl font-bold text-center mb-8"
                    style={{ color: customColors.primary }}
                  >
                    <Quote 
                      className="w-6 h-6 inline mr-2" 
                      style={{ color: customColors.highlightColor || customColors.secondary }}
                    />
                    Advice for Other Youth Organizations
                  </h3>
                  
                  <div className="max-w-4xl mx-auto">
                    <div 
                      className="bg-white border-2 border-gray-300 p-6 rounded-lg shadow-md"
                      style={{ borderLeftColor: customColors.highlightColor || customColors.secondary, borderLeftWidth: '6px' }}
                    >
                      <p className="text-lg text-gray-800 leading-relaxed italic font-semibold">
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
                className="text-center py-12 border-t border-gray-200"
              >
                <h4 
                  className="text-2xl font-bold mb-4"
                  style={{ color: customColors.primary }}
                >
                  Thank you for making a difference
                </h4>
                <p className="text-gray-600 mb-6">
                  Created with Foundly Wrapped • {new Date().toLocaleDateString()}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>Perfect for community sharing</span>
                  <span>•</span>
                  <span>Great for social media</span>
                  <span>•</span>
                  <span>Ideal for supporter updates</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 
