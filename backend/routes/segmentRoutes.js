import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// POST /api/segments/preview - Preview audience size for given rules
router.post("/preview", async (req, res) => {
  try {
    const { ruleGroups } = req.body;
    
    if (!ruleGroups || !Array.isArray(ruleGroups)) {
      return res.json({ count: 0 });
    }

    // Build MongoDB query from rule groups
    const orConditions = [];

    for (const group of ruleGroups) {
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
          // For OR within group, each rule becomes a separate condition
          orConditions.push(...andConditions);
        }
      }
    }

    let query = {};
    if (orConditions.length > 0) {
      query = { $or: orConditions };
    }

    const count = await Customer.countDocuments(query);
    res.json({ count });
  } catch (err) {
    console.error("Preview error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;