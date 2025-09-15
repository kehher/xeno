import Campaign from "../models/Campaign.js";
import Customer from "../models/Customer.js";
import CommunicationLog from "../models/CommunicationLog.js";
import { sendMessageToVendor } from "../utils/vendorAPI.js";

export const createCampaign = async (req, res) => {
  try {
    const { name, ruleGroups, message } = req.body;

    // Create campaign
    const campaign = await Campaign.create({
      name: name || ('Campaign ' + Date.now()),
      rules: ruleGroups,
      message
    });

    // Build audience query from rule groups
    const orConditions = [];

    for (const group of ruleGroups || []) {
      if (!group.rules || !Array.isArray(group.rules)) continue;

      const andConditions = [];

      for (const rule of group.rules) {
        const { field, operator, value } = rule;
        
        if (!field || !operator || value === undefined) continue;

        let condition = {};

        switch (operator) {
          case '>':
            condition[field] = { $gt: Number(value) };
            break;
          case '<':
            condition[field] = { $lt: Number(value) };
            break;
          case '>=':
            condition[field] = { $gte: Number(value) };
            break;
          case '<=':
            condition[field] = { $lte: Number(value) };
            break;
          case '=':
            condition[field] = Number(value);
            break;
          case '!=':
            condition[field] = { $ne: Number(value) };
            break;
          default:
            continue;
        }

        andConditions.push(condition);
      }

      if (andConditions.length > 0) {
        if (group.connector === 'AND') {
          orConditions.push({ $and: andConditions });
        } else {
          orConditions.push(...andConditions);
        }
      }
    }

    let query = {};
    if (orConditions.length > 0) {
      query = { $or: orConditions };
    }

    const audience = await Customer.find(query);
    
    let sent = 0, failed = 0;
    
    // Send messages to audience
    for (const customer of audience) {
      const comm = await CommunicationLog.create({
        campaignId: campaign._id,
        customerId: customer._id,
        message,
        status: "PENDING"
      });

      const { vendorMessageId, status } = await sendMessageToVendor(customer, message, campaign._id);
      
      await CommunicationLog.findByIdAndUpdate(comm._id, {
        vendorMessageId,
        status: status === "SENT" ? "SENT" : "FAILED",
        deliveredAt: status === "SENT" ? new Date() : null
      });

      if (status === "SENT") sent++;
      else failed++;
    }

    // Update campaign stats
    campaign.stats = {
      audienceSize: audience.length,
      sent,
      failed
    };
    await campaign.save();

    res.json({ campaign });
  } catch (err) {
    console.error("Create campaign error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const listCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const campaignDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const campaign = await Campaign.findById(id);
    const logs = await CommunicationLog.find({ campaignId: id })
      .populate("customerId");
    res.json({ campaign, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};