import express from "express";
import { createCampaign, listCampaigns, campaignDetails } from "../controllers/campaignController.js";
import CommunicationLog from "../models/CommunicationLog.js";

const router = express.Router();

// Campaign CRUD routes
router.post("/", createCampaign);
router.get("/", listCampaigns);
router.get("/:id", campaignDetails);

// GET /api/campaigns/:id/logs  -> logs for a single campaign
router.get("/:id/logs", async (req, res) => {
  try {
    const campaignId = req.params.id;
    const logs = await CommunicationLog.find({ campaignId })
      .populate("customerId", "name email")
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error("GET /:id/logs error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/campaigns/logs/all -> all logs (recent first)
router.get("/logs/all", async (req, res) => {
  try {
    const logs = await CommunicationLog.find()
      .populate("campaignId", "rules message")
      .populate("customerId", "name email")
      .sort({ timestamp: -1 })
      .limit(200);
    res.json(logs);
  } catch (err) {
    console.error("GET /logs/all error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;