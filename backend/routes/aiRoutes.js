import express from "express";
import { generateRules } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/generate-rules - Generate audience rules from natural language
router.post("/generate-rules", generateRules);

export default router;