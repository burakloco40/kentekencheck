"use client";
import { useState } from "react";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

export function AIAdvice({ vehicle }: Props) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getAdvice() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle }),
      });
      const data = await res.json();
      if (data.advice) {
        setAdvice(data.advice);
      } else {
        setError("Geen advies: " + JSON.stringify(data));
      }
    } catch (err) {
      setError("Fout: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{background:'#f0f9ff',border:'2px solid #bae6fd',borderRadius:'16px',overflow:'hidden'}}>
      <div style={{background:'#e0f2fe',borderBottom:'2px solid #bae6fd',padding:'12px 20px',display:'flex',alignItems:'center',gap:'8px'}}>
        <span style={{fontSize:'18px'}}>🤖</span>
        <h2 style={{fontSize:'12px',fontWeight:700,color:'#0369a1',textTransform:'uppercase',letterSpacing:'0.1em',margin:0}}>AI Voertuigadvies</h2>
      </div>
      <div style={{padding:'20px'}}>
        {!advice && !loading && (
          <div>
            <p style={{fontSize:'14px',color:'#374151',margin:'0 0 16px 0'}}>
              Ontvang een AI-analyse over dit voertuig: betrouwbaarheid, bekende problemen en aankoopadvies.
            </p>
            <button onClick={getAdvice} style={{background:'#0284c7',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'14px',fontWeight:600,cursor:'pointer'}}>
              Analyseer dit voertuig
            </button>
          </div>
        )}
        {loading && (
          <div style={{display:'flex',alignItems:'center',gap:'12px',color:'#0369a1'}}>
            <div style={{width:'20px',height:'20px',border:'3px solid #bae6fd',borderTopColor:'#0284c7',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
            <span style={{fontSize:'14px'}}>AI analyseert het voertuig...</span>
          </div>
        )}
        {error && <p style={{color:'#dc2626',fontSize:'14px',margin:0}}>{error}</p>}
        {advice && (
          <div style={{fontSize:'14px',color:'#1e3a5f',lineHeight:'1.8',whiteSpace:'pre-wrap'}}>{advice}</div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}