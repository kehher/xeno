import mongoose from "mongoose";
const CustomerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  totalSpend: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});
export default mongoose.model("Customer", CustomerSchema);
