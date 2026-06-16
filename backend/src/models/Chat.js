import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
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
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true
    },
    sources: [
      {
        index: Number,
        preview: String,
        score: Number
      }
    ]
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

chatSchema.index({ userId: 1, documentId: 1, createdAt: 1 });

export default mongoose.model('Chat', chatSchema);
