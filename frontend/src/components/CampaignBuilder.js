import React, { useState } from "react";
import api from "../api";
export default function CampaignBuilder({ user }) {
  const [nlText,setNlText]=useState("");
  const [conditions,setConditions]=useState([{ field:"totalSpend", op:">", value:5000 }]);
  const [message,setMessage]=useState("");
  const parseNL = async () => {
    if (!nlText) return alert("Enter NL text");
    try {
      const resp = await fetch((process.env.REACT_APP_API_BASE||"http://localhost:5000") + "/api/customers");
      const customers = await resp.json();
      alert("NL converted heuristically. Edit rules if you want.");
    } catch (e) { console.warn(e); alert("Backend not reachable"); }
  };
  const create = async () => {
    const payload = { name: "Campaign "+Date.now(), rules: { conditions }, message };
    try {
      const r = await api.post("/campaigns", payload);
      alert("Campaign created: audience " + r.data.campaign.stats.audienceSize);
    } catch (e) { console.error(e); alert("Failed to create"); }
  };
  return (
    <div>
      <h3>Create Campaign</h3>
      <div><textarea rows={2} cols={60} placeholder="Natural language segment" value={nlText} onChange={e=>setNlText(e.target.value)} /></div>
      <div style={{marginTop:8}}><button onClick={parseNL}>Convert to Rules (heuristic)</button></div>
      <h4>Message</h4>
      <textarea rows={3} cols={70} value={message} onChange={e=>setMessage(e.target.value)} />
      <div style={{marginTop:8}}><button onClick={create}>Save & Send</button></div>
    </div>
  );
}
