// top of file (add these imports if not present)
import Campaign from "../models/Campaign.js";
import Customer from "../models/Customer.js";
import CommunicationLog from "../models/CommunicationLog.js";

/**
 * Create campaign, compute audience, save campaign, and write communication logs.
 * Expects req.body to contain at least { rules, message } or equivalent.
 */
export const createCampaign = async (req, res) => {
  try {
    const { rules, message } = req.body;

    // 1) create and save the campaign
    const campaign = new Campaign({
      rules,
      message,
      createdAt: new Date(),
    });
    await campaign.save();

    // 2) compute audience (adapt this query to your rule format)
    // NOTE: update the query to match how your app encodes rules.
    // Below is a simple example for rules like { totalSpendGt: 5000, lastActiveBefore: ISODate }
    let filter = {};

    // Example fallback: if rules is stored as JSON with fields
    if (rules) {
      // simple heuristic parsing — change according to your rules structure
      if (rules.totalSpendGt) filter.totalSpend = { $gte: rules.totalSpendGt };
      if (rules.lastActiveBefore) filter.lastActive = { $lt: new Date(rules.lastActiveBefore) };
      // you can expand this mapping based on your rule format
    }

    // If no rules / unknown format, default to selecting zero customers (safe)
    const customers = Object.keys(filter).length ? await Customer.find(filter) : [];

    // 3) insert communication logs for every matched customer
    const logs = customers.map(c => ({
      campaignId: campaign._id,
      customerId: c._id,
      message: message || "",
      status: "SENT",
      timestamp: new Date()
    }));

    if (logs.length > 0) {
      await CommunicationLog.insertMany(logs);
    }

    // 4) return response with audience size
    res.status(201).json({
      success: true,
      campaign,
      audienceSize: customers.length
    });
  } catch (err) {
    console.error("createCampaign error:", err);
    res.status(500).json({ error: err.message });
  }
};
