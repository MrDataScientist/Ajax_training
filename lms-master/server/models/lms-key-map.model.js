import mongoose from 'mongoose';

/**
 * LMSKeyMap Schema
 */
const LMSKeyMapSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  lmsKey: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Methods
 */
LMSKeyMapSchema.method({
});

/**
 * Statics
 */
LMSKeyMapSchema.statics = {
};

export default mongoose.model('LMSKeyMap', LMSKeyMapSchema);
