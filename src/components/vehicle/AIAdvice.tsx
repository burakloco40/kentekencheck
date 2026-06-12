"use client";
import { useState, useEffect } from "react";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

export function AIAdvice({ vehicle }: Props) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [torque, setTorque] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAdvice() {
      try {
        const res = await fetch("/api/ai-advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicle }),
        });
        const data = await res.json();
        if (data.advice) {
          const full: string = data.advice;
          const torqueMatch = full.match(/KOPPELMOMENT:\s*([^\n]+)/);
          if (torqueMatch) setTorque(torqueMatch[1].trim());
          const withoutTorque = full.replace(/KOPPELMOMENT:[^\n]+\n?/, "").trim();
          setAdvice(withoutTorque);
        } else {
          setError("Kon geen advies ophalen.");
        }
      } catch (err) {
        setError("Fout: " + String(err));
      } finally {
        setLoading(false);
      }
    }
    getAdvice();
  }, [vehicle]);

  return (
    <>
      {(loading || torque) && (
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'14px',overflow:'hidden'}}>
          <div style={{background:'#f3f4f6',borderBottom:'1px solid #e5e7eb',padding:'10px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
            <span>🔧</span>
            <span style={{fontSize:'12px',fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'0.08em'}}>Koppelmoment (AI)</span>
          </div>
          <div style={{padding:'16px 20px'}}>
            {loading ? (
              <div style={{display:'flex',alignItems:'center',gap:'10px',color:'#6b7280'}}>
                <div style={{width:'16px',height:'16px',border:'2px solid #e5e7eb',borderTopColor:'#6b7280',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
                <span style={{fontSize:'14px'}}>Ophalen...</span>
              </div>
            ) : (
              <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>{torque ?? "Niet beschikbaar"}</span>
            )}
          </div>
        </div>
      )}

      <div style={{background:'#f0f9ff',border:'2px solid #bae6fd',borderRadius:'16px',overflow:'hidden'}}>
        <div style={{background:'#e0f2fe',borderBottom:'2px solid #bae6fd',padding:'12px 20px',display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'18px'}}>🤖</span>
          <h2 style={{fontSize:'12px',fontWeight:700,color:'#0369a1',textTransform:'uppercase',letterSpacing:'0.1em',margin:0}}>AI Voertuigadvies</h2>
        </div>
        <div style={{padding:'20px'}}>
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
    </>
  );
}