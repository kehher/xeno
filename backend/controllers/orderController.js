import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
export const ingestOrders = async (req,res) => {
  try {
    const orders = req.body.orders || [];
    const results = [];
    for (const o of orders) {
      const order = await Order.create({ customerId: o.customerId, amount: o.amount, createdAt: o.createdAt? new Date(o.createdAt): new Date() });
      if (o.customerId) await Customer.findByIdAndUpdate(o.customerId, { $inc: { totalSpend: o.amount||0, visits: 1 }, $set: { lastActive: order.createdAt }});
      results.push(order);
    }
    res.json({ inserted: results.length });
  } catch (err) { res.status(500).json({ error: err.message }) }
};
