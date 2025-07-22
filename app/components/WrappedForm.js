'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  Quote, 
  Users, 
  Calendar, 
  Target, 
  DollarSign,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  Star,
  AlertTriangle,
  MapPin,
  Building
} from 'lucide-react';
import { getRandomPrompt } from '../../lib/prompts';

export default function WrappedForm({ formData, setFormData, onSave, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const steps = [
    { id: 1, title: 'Organization Info', icon: Building },
    { id: 2, title: 'Choose Month', icon: Calendar },
    { id: 3, title: 'Add Stats', icon: Target },
    { id: 4, title: 'Add Highlights', icon: Star },
    { id: 5, title: 'Share & Inspire', icon: Star },
    { id: 6, title: 'Preview & Save', icon: Star }
  ];

  useEffect(() => {
    setCurrentPrompt(getRandomPrompt('reflection'));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlurbChange = (index, value) => {
    const newBlurbs = [...formData.highlightBlurbs];
    newBlurbs[index] = value;
    setFormData(prev => ({ ...prev, highlightBlurbs: newBlurbs }));
  };

  const handleInitiativeChange = (index, value) => {
    const newInitiatives = [...(formData.topInitiatives || [])];
    newInitiatives[index] = value;
    setFormData(prev => ({ ...prev, topInitiatives: newInitiatives }));
  };

  const addBlurb = () => {
    setFormData(prev => ({
      ...prev,
      highlightBlurbs: [...prev.highlightBlurbs, '']
    }));
  };

  const removeBlurb = (index) => {
    if (formData.highlightBlurbs.length > 1) {
      const newBlurbs = formData.highlightBlurbs.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, highlightBlurbs: newBlurbs }));
    }
  };

  const addInitiative = () => {
    setFormData(prev => ({
      ...prev,
      topInitiatives: [...(prev.topInitiatives || []), '']
    }));
  };

  const removeInitiative = (index) => {
    if ((formData.topInitiatives || []).length > 1) {
      const newInitiatives = (formData.topInitiatives || []).filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, topInitiatives: newInitiatives }));
    }
  };

  const getNewPrompt = () => {
    setCurrentPrompt(getRandomPrompt('reflection'));
    setShowPrompt(true);
    setTimeout(() => setShowPrompt(false), 3000);
  };

  const handleSubmit = () => {
    // Filter out empty blurbs and initiatives
    const filteredBlurbs = formData.highlightBlurbs.filter(blurb => blurb.trim());
    const filteredInitiatives = (formData.topInitiatives || []).filter(initiative => initiative.trim());
    const dataToSave = {
      ...formData,
      highlightBlurbs: filteredBlurbs,
      topInitiatives: filteredInitiatives
    };
    onSave(dataToSave);
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.orgName && formData.orgLocation;
      case 2:
        return formData.month;
      case 3:
        return formData.hoursVolunteered > 0 && formData.memberCount > 0 && formData.eventCount > 0;
      case 4:
        return formData.highlightBlurbs.some(blurb => blurb.trim());
      case 5:
        return true; // Optional step
      default:
        return true;
    }
  };

  const canProceed = isStepValid(currentStep);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#FFFBF5] max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FFFBF5] border-b border-[#F7FAFC] p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1A202C]">
              Create Your Monthly Wrapped
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#718096] hover:text-[#1A202C] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-[#1A202C]' : 'text-[#718096]'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-2xl ${
                    currentStep >= step.id 
                      ? 'bg-[#FF6B6B] text-white' 
                      : 'bg-[#F7FAFC] text-[#718096]'
                  }`}>
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 rounded-full ${currentStep > step.id ? 'bg-[#FF6B6B]' : 'bg-[#F7FAFC]'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#FFD633] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A202C] mb-2">Tell us about your organization</h3>
                  <p className="text-[#4A5568]">This information will be displayed publicly on your Wrapped page</p>
                </div>

                {/* Community Sharing Info */}
                <div className="bg-[#FFF0B3] border border-[#FFE066] rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#FF6B6B] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#1A202C] mb-1">Share Your Impact!</h4>
                      <p className="text-[#4A5568] text-sm">
                        Your Wrapped page will be publicly accessible, so you can inspire others in the community with your amazing work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1A202C] mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={formData.orgName || ''}
                      onChange={(e) => handleInputChange('orgName', e.target.value)}
                      className="form-input"
                      placeholder="e.g., Youth Action Collective"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.orgLocation || ''}
                      onChange={(e) => handleInputChange('orgLocation', e.target.value)}
                      className="form-input"
                      placeholder="e.g., San Francisco, CA"
                      maxLength={100}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#1a202c] mb-2">
                      Brief Description (Optional)
                    </label>
                    <textarea
                      value={formData.orgDescription || ''}
                      onChange={(e) => handleInputChange('orgDescription', e.target.value)}
                      className="form-textarea"
                      placeholder="A short description of what your organization does..."
                      rows={3}
                      maxLength={200}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#4ecdc4] to-[#ffd633] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a202c] mb-2">Choose Your Month</h3>
                  <p className="text-[#4a5568]">Select which month you want to create a Wrapped for</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2">
                      Month and Year (YYYY-MM format)
                    </label>
                    <input
                      type="month"
                      value={formData.month}
                      onChange={(e) => handleInputChange('month', e.target.value)}
                      className="form-input"
                      placeholder="e.g., 2025-01"
                    />
                    <p className="text-sm text-[#718096] mt-2">
                      Enter the month and year for this snapshot (e.g., 2025-01 for January 2025)
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a202c] mb-2">
                        Quick Select - Recent Months
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 6 }, (_, i) => {
                          const date = new Date();
                          date.setMonth(date.getMonth() - i);
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const monthName = date.toLocaleString('default', { month: 'short' });
                          const value = `${year}-${month}`;
                          
                          return (
                            <button
                              key={value}
                              onClick={() => handleInputChange('month', value)}
                              className={`p-3 border-2 text-center transition-all rounded-xl text-sm ${
                                formData.month === value
                                  ? 'border-[#ff6b6b] bg-[#fff0b3] text-[#1a202c]'
                                  : 'border-[#f7fafc] hover:border-[#ff6b6b] hover:bg-[#fff0b3]'
                              }`}
                            >
                              {monthName} {year}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ffd633] to-[#ff6b6b] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a202c] mb-2">Your Impact Stats</h3>
                  <p className="text-[#4a5568]">Share the numbers that tell your story</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Hours Volunteered
                    </label>
                    <input
                      type="number"
                      value={formData.hoursVolunteered}
                      onChange={(e) => handleInputChange('hoursVolunteered', parseInt(e.target.value) || 0)}
                      className="form-input"
                      placeholder="e.g., 150"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Members
                    </label>
                    <input
                      type="number"
                      value={formData.memberCount}
                      onChange={(e) => handleInputChange('memberCount', parseInt(e.target.value) || 0)}
                      className="form-input"
                      placeholder="e.g., 25"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Number of Events
                    </label>
                    <input
                      type="number"
                      value={formData.eventCount}
                      onChange={(e) => handleInputChange('eventCount', parseInt(e.target.value) || 0)}
                      className="form-input"
                      placeholder="e.g., 8"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Total Funds Raised (Optional)
                    </label>
                    <input
                      type="number"
                      value={formData.fundsRaised}
                      onChange={(e) => handleInputChange('fundsRaised', parseInt(e.target.value) || 0)}
                      className="form-input"
                      placeholder="e.g., 2500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="bg-[#fff0b3] border border-[#ffe066] rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-[#1a202c] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-[#1a202c] mb-1">Pro tip</h4>
                      <p className="text-[#4a5568] text-sm">
                        These stats will be displayed publicly on your Wrapped page. Focus on the impact that matters most to your community.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#a8e6cf] to-[#4ecdc4] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a202c] mb-2">Add Your Highlights</h3>
                  <p className="text-[#4a5568]">Share the stories and moments that made this month special</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2">
                      Team Vibe of the Month
                    </label>
                    <input
                      type="text"
                      value={formData.orgVibe}
                      onChange={(e) => handleInputChange('orgVibe', e.target.value)}
                      className="form-input"
                      placeholder="e.g., energized, collaborative, determined"
                      maxLength={50}
                    />
                    <p className="text-xs text-[#718096] mt-1">Describe your team's energy in a few words</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2 flex items-center gap-2">
                      <Quote className="w-4 h-4" />
                      Quote of the Month
                    </label>
                    <textarea
                      value={formData.quoteOfTheMonth}
                      onChange={(e) => handleInputChange('quoteOfTheMonth', e.target.value)}
                      className="form-textarea"
                      placeholder="Share an inspiring quote, something someone said, or a reflection that captures this month's spirit"
                      rows={3}
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[#1a202c]">
                        Highlight Stories
                      </label>
                      <button
                        type="button"
                        onClick={getNewPrompt}
                        className="text-xs text-[#ff6b6b] hover:text-[#ff5252] flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        New prompt
                      </button>
                    </div>
                    
                    <AnimatePresence>
                      {showPrompt && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-[#fff0b3] border border-[#ffe066] rounded-2xl p-3 mb-4"
                        >
                          <p className="text-sm text-[#1a202c] italic">"{currentPrompt}"</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {formData.highlightBlurbs.map((blurb, index) => (
                      <div key={index} className="flex gap-2 mb-3">
                        <textarea
                          value={blurb}
                          onChange={(e) => handleBlurbChange(index, e.target.value)}
                          className="form-textarea flex-1"
                          placeholder="Share a highlight, story, or reflection from this month..."
                          rows={2}
                          maxLength={300}
                        />
                        {formData.highlightBlurbs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBlurb(index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addBlurb}
                      className="text-[#ff6b6b] hover:text-[#ff5252] flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add another highlight
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b6b] to-[#a8e6cf] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a202c] mb-2">Share & Inspire</h3>
                  <p className="text-[#4a5568]">Share your top initiatives and advice for other youth organizations</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2">
                      Top Initiatives
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(formData.topInitiatives || []).map((initiative, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={initiative}
                            onChange={(e) => handleInitiativeChange(index, e.target.value)}
                            className="form-input flex-1"
                            placeholder={`Initiative ${index + 1}`}
                            maxLength={100}
                          />
                          {(formData.topInitiatives || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeInitiative(index)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addInitiative}
                      className="text-[#ff6b6b] hover:text-[#ff5252] flex items-center gap-2 text-sm mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add another initiative
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a202c] mb-2">
                      Advice for Other Youth Organizations
                    </label>
                                         <textarea
                       value={formData.adviceForOthers || ''}
                       onChange={(e) => handleInputChange('adviceForOthers', e.target.value)}
                       className="form-textarea"
                       placeholder="Share your wisdom and advice for other youth organizations looking to make a difference."
                       rows={4}
                       maxLength={500}
                     />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b6b] to-[#a8e6cf] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a202c] mb-2">Ready to Create Your Wrapped?</h3>
                  <p className="text-[#4a5568]">Review your information and create your public monthly snapshot</p>
                </div>

                <div className="bg-[#fff0b3] p-6 rounded-2xl">
                  <h4 className="font-semibold text-[#1a202c] mb-4">Preview Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#718096]">Organization:</span>
                      <span className="ml-2 font-medium">{formData.orgName}</span>
                    </div>
                    <div>
                      <span className="text-[#718096]">Location:</span>
                      <span className="ml-2 font-medium">{formData.orgLocation}</span>
                    </div>
                    <div>
                      <span className="text-[#718096]">Month:</span>
                      <span className="ml-2 font-medium">{formData.monthName} {formData.year}</span>
                    </div>
                    <div>
                      <span className="text-[#718096]">Hours:</span>
                      <span className="ml-2 font-medium">{formData.hoursVolunteered}</span>
                    </div>
                    <div>
                      <span className="text-[#718096]">Members:</span>
                      <span className="ml-2 font-medium">{formData.memberCount}</span>
                    </div>
                    <div>
                      <span className="text-[#718096]">Events:</span>
                      <span className="ml-2 font-medium">{formData.eventCount}</span>
                    </div>
                    {formData.fundsRaised > 0 && (
                      <div>
                        <span className="text-[#718096]">Funds Raised:</span>
                        <span className="ml-2 font-medium">${formData.fundsRaised.toLocaleString()}</span>
                      </div>
                    )}
                    {formData.orgVibe && (
                      <div>
                        <span className="text-[#718096]">Vibe:</span>
                        <span className="ml-2 font-medium">{formData.orgVibe}</span>
                      </div>
                    )}
                    {formData.topInitiatives && formData.topInitiatives.length > 0 && (
                      <div>
                        <span className="text-[#718096]">Top Initiatives:</span>
                        <ul className="ml-2 text-sm">
                          {formData.topInitiatives.map((initiative, index) => (
                            <li key={index}>• {initiative}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                                         {formData.adviceForOthers && (
                       <div>
                         <span className="text-[#718096]">Advice:</span>
                         <p className="ml-2 text-sm text-[#1a202c]">"{formData.adviceForOthers}"</p>
                       </div>
                     )}
                  </div>
                  
                  {formData.quoteOfTheMonth && (
                    <div className="mt-4 p-3 bg-white border-l-4 border-[#ff6b6b] rounded-r-2xl">
                      <p className="text-sm italic text-[#1a202c]">"{formData.quoteOfTheMonth}"</p>
                    </div>
                  )}
                  
                  {formData.highlightBlurbs.filter(b => b.trim()).length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-[#718096] mb-2">Highlights:</p>
                      <ul className="space-y-1">
                        {formData.highlightBlurbs.filter(b => b.trim()).map((blurb, index) => (
                          <li key={index} className="text-sm text-[#1a202c]">• {blurb}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Final Public Warning */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900 mb-1">Public Information</h4>
                      <p className="text-red-700 text-sm">
                        By creating this Wrapped, you're making this information publicly available. Anyone with the link can view your organization's stats and highlights.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-[#f7fafc]">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 text-[#718096] hover:text-[#1a202c] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div className="flex gap-3">
              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary"
                >
                  <Star className="w-4 h-4" />
                  Create My Wrapped
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 