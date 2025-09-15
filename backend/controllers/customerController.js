import Customer from "../models/Customer.js";
export const ingestCustomers = async (req,res) => {
  try {
    const customers = req.body.customers || [];
    const results = [];
    for (const c of customers) {
      const doc = await Customer.findOneAndUpdate({ email: c.email }, { $set: { name: c.name, lastActive: c.lastActive? new Date(c.lastActive): new Date(), totalSpend: c.totalSpend||0, visits: c.visits||0 } }, { upsert:true, new:true });
      results.push(doc);
    }
    res.json({ inserted: results.length });
  } catch (err) { res.status(500).json({ error: err.message }) }
};
export const listCustomers = async (req,res) => { const customers = await (await import("../models/Customer.js")).default.find({}).limit(200); res.json(customers); };
