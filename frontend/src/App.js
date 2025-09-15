import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CampaignBuilder from "./components/CampaignBuilder";
import CampaignHistory from "./components/CampaignHistory";
export default function App(){
  const [user]=useState(null);
  return (
    <BrowserRouter>
      <div style={{padding:20}}>
        <header style={{display:"flex", gap:12}}>
          <h2>Xeno CRM Demo</h2>
          <nav><Link to="/">Home</Link> | <Link to="/campaigns/new">Create</Link> | <Link to="/campaigns/history">History</Link></nav>
        </header>
        <hr/>
        <Routes>
          <Route path="/" element={<div>Welcome to Xeno CRM Demo</div>} />
          <Route path="/campaigns/new" element={<CampaignBuilder user={user} />} />
          <Route path="/campaigns/history" element={<CampaignHistory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
