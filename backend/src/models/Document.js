import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema(
  {
    index: Number,
    text: String,
    embedding: [Number]
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    originalName: String,
    extractedText: {
      type: String,
      default: ''
    },
    chunks: {
      type: [chunkSchema],
      default: []
    },
    summary: {
      type: String,
      default: ''
    },
    keywords: {
      type: [String],
      default: []
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

documentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Document', documentSchema);
