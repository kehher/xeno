import mongoose from "mongoose";

const communicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["SENT", "DELIVERED", "FAILED"], default: "SENT" },
  timestamp: { type: Date, default: Date.now }
});

const CommunicationLog = mongoose.model("CommunicationLog", communicationLogSchema);

export default CommunicationLog;
