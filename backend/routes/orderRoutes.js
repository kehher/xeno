import express from "express";
import { ingestOrders } from "../controllers/orderController.js";
const router = express.Router();
router.post("/ingest", ingestOrders);
export default router;
