import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
export async function sendMessageToVendor(customer, message, campaignId) {
  const vendorMessageId = uuidv4();
  const status = Math.random() < 0.9 ? "SENT" : "FAILED";
  setTimeout(async () => {
    try {
      await axios.post(`${BACKEND}/api/delivery/receipt`, { vendorMessageId, campaignId, customerId: customer._id, status });
    } catch (e) {
      console.warn("vendor callback failed:", e.message);
    }
  }, 300 + Math.random()*700);
  return { vendorMessageId, status };
}
