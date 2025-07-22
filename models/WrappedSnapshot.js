import mongoose from 'mongoose';

const WrappedSnapshotSchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
    index: true,
  },
  uniqueSnapshotId: {
    type: String,
    required: true,
    unique: true,
    // This ensures each snapshot is unique even for same org/month
  },
  orgName: {
    type: String,
    required: false,
    maxlength: 100,
  },
  orgLocation: {
    type: String,
    maxlength: 100,
  },
  month: {
    type: String,
    required: true,
    // Format: "2025-01" for January 2025
  },
  year: {
    type: Number,
    // Will be auto-generated from month
  },
  monthName: {
    type: String,
    // Will be auto-generated from month
  },
  
  // Core stats
  hoursVolunteered: {
    type: Number,
    required: true,
    min: 0,
  },
  memberCount: {
    type: Number,
    required: true,
    min: 0,
  },
  eventCount: {
    type: Number,
    required: true,
    min: 0,
  },
  fundsRaised: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Creative elements
  orgVibe: {
    type: String,
    maxlength: 50,
    // e.g., "chaotic good", "caffeinated", "victorious"
  },
  quoteOfTheMonth: {
    type: String,
    maxlength: 200,
  },
  highlightBlurbs: [{
    type: String,
    maxlength: 300,
  }],
  
  // New fields for enhanced sharing
  topInitiatives: [{
    type: String,
    maxlength: 200,
    // e.g., "Launched mentorship program", "Organized community cleanup"
  }],
  adviceForOthers: {
    type: String,
    maxlength: 500,
    // Advice for other youth organizations
  },
  
  // Visual theme
  theme: {
    type: String,
    enum: ['sunset', 'ocean', 'forest', 'cosmic', 'vintage', 'neon', 'pastel', 'earth'],
    default: 'sunset',
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  // Unique constraint for org/month combination
}, {
  timestamps: true,
});

// Compound index to ensure unique org/month combinations
// Temporarily disabled to allow multiple snapshots per org per month
// WrappedSnapshotSchema.index({ orgId: 1, month: 1 }, { unique: true });

// Virtual for display name
WrappedSnapshotSchema.virtual('displayName').get(function() {
  return `${this.monthName} ${this.year}`;
});

// Pre-save middleware to update monthName and year from month
WrappedSnapshotSchema.pre('save', function(next) {
  if (this.month) {
    const [year, monthNum] = this.month.split('-');
    this.year = parseInt(year);
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.monthName = monthNames[parseInt(monthNum) - 1];
  }
  next();
});

export default mongoose.models.WrappedSnapshot || mongoose.model('WrappedSnapshot', WrappedSnapshotSchema); 