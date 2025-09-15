import React, { useEffect, useState } from "react";
import api from "../api";
export default function CampaignHistory(){
  const [campaigns,setCampaigns]=useState([]);
  useEffect(()=>{ (async()=>{ try { const r = await api.get("/campaigns"); setCampaigns(r.data);}catch(e){console.warn(e);} })(); },[]);
  return (
    <div>
      <h3>Campaign History</h3>
      <table border="1" cellPadding="6"><thead><tr><th>Name</th><th>Created</th><th>Audience</th><th>Sent</th><th>Failed</th></tr></thead>
      <tbody>{campaigns.map(c=>(
        <tr key={c._id}><td>{c.name}</td><td>{new Date(c.createdAt).toLocaleString()}</td><td>{c.stats?.audienceSize||'-'}</td><td>{c.stats?.sent||'-'}</td><td>{c.stats?.failed||'-'}</td></tr>
      ))}</tbody></table>
    </div>
  );
}
