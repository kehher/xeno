import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rules: { type: mongoose.Schema.Types.Mixed, required: true }, // Store rule groups
  message: { type: String, required: true },
  stats: {
    audienceSize: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Campaign", CampaignSchema);