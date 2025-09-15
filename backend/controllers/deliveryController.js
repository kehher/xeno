import CommunicationLog from "../models/CommunicationLog.js";
export const deliveryReceipt = async (req,res) => {
  try {
    const { vendorMessageId, campaignId, customerId, status } = req.body;
    const update = { vendorMessageId, status: status==="SENT"?"SENT":"FAILED", deliveredAt: status==="SENT"? new Date(): null };
    await CommunicationLog.findOneAndUpdate({ vendorMessageId }, update);
    await CommunicationLog.findOneAndUpdate({ campaignId, customerId }, update);
    res.json({ ok:true });
  } catch (err) { res.status(500).json({ error: err.message }) }
};
