import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    introduction: {
      type: String,
      default: ''
    },
    methodology: {
      type: String,
      default: ''
    },
    keyFindings: {
      type: String,
      default: ''
    },
    conclusion: {
      type: String,
      default: ''
    },
    literatureReview: {
      type: String,
      default: ''
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

reportSchema.index({ userId: 1, documentId: 1, createdAt: -1 });

export default mongoose.model('Report', reportSchema);
