import dotenv from "dotenv"; dotenv.config();
import connectDB from "../config/db.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
await connectDB();
await Customer.deleteMany({});
await Order.deleteMany({});
const now = new Date();
const list = [
  { name: "Amit Sharma", email: "amit@example.com", totalSpend: 15000, visits: 10, lastActive: new Date(now - 2*24*3600*1000) },
  { name: "Nikita Verma", email: "nikita@example.com", totalSpend: 4500, visits: 2, lastActive: new Date(now - 190*24*3600*1000) },
  { name: "Mohit Singh", email: "mohit@example.com", totalSpend: 8000, visits: 5, lastActive: new Date(now - 30*24*3600*1000) }
];
await Customer.insertMany(list);
console.log("Seeded customers");
process.exit(0);
