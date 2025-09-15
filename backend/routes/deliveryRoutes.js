import express from "express";
import { deliveryReceipt } from "../controllers/deliveryController.js";
const router = express.Router();
router.post("/receipt", deliveryReceipt);
export default router;
