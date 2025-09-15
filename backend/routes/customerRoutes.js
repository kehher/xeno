import express from "express";
import { ingestCustomers, listCustomers } from "../controllers/customerController.js";
const router = express.Router();
router.post("/ingest", ingestCustomers);
router.get("/", listCustomers);
export default router;
