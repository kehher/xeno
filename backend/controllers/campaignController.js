import Campaign from "../models/Campaign.js";
import CommunicationLog from "../models/CommunicationLog.js";
import { sendMessageToVendor } from "../utils/vendorAPI.js";
export const createCampaign = async (req,res) => {
  try {
    const { name, rules, message } = req.body;
    const campaign = await Campaign.create({ name: name||('Campaign '+Date.now()), rules, message });
    const audience = await Campaign.getAudience(rules);
    let sent=0, failed=0;
    for (const cust of audience) {
      const comm = await CommunicationLog.create({ campaignId: campaign._id, customerId: cust._id, status: "PENDING" });
      const { vendorMessageId, status } = await sendMessageToVendor(cust, message, campaign._id);
      await CommunicationLog.findByIdAndUpdate(comm._id, { vendorMessageId, status: status==="SENT"?"SENT":"FAILED", deliveredAt: status==="SENT"? new Date(): null });
      if (status==="SENT") sent++; else failed++;
    }
    campaign.stats = { audienceSize: audience.length, sent, failed };
    await campaign.save();
    res.json({ campaign });
  } catch (err) { res.status(500).json({ error: err.message }) }
};
export const listCampaigns = async (req,res) => { const items = await Campaign.find({}).sort({ createdAt:-1 }).limit(50); res.json(items); };
export const campaignDetails = async (req,res) => { const id = req.params.id; const campaign = await Campaign.findById(id); const logs = await CommunicationLog.find({ campaignId: id }).populate("customerId"); res.json({ campaign, logs }); };
