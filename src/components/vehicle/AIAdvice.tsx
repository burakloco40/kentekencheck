"use client";
import { useState, useEffect } from "react";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

function TireVisual({ size }: { size: string }) {
  const match = size.match(/(\d+)\/(\d+)R(\d+)/);
  if (!match) return <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>{size}</span>;
  const width = match[1];
  const profile = match[2];
  const rim = match[3];

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'12px'}}>
        <span style={{fontSize:'20px',fontWeight:800,color:'#0f2040'}}>{size}</span>
      </div>
      <div style={{display:'flex',gap:'12px',alignItems:'flex-end'}}>
        {[
          {label:'Breedte', value: width, unit: 'mm'},
          {label:'Profiel', value: profile, unit: '%'},
          {label:'Velg', value: `R${rim}`, unit: ''},
        ].map(item => (
          <div key={item.label} style={{textAlign:'center'}}>
            <div style={{background:'#F5C518',color:'#0f2040',borderRadius:'6px',padding:'4px 10px',fontWeight:700,fontSize:'14px',marginBottom:'4px'}}>
              {item.value}{item.unit}
            </div>
            <div style={{fontSize:'11px',color:'#6b7280'}}>{item.label}</div>
          </div>
        ))}
      </div>
      <p style={{fontSize:'11px',color:'#9ca3af',margin:'8px 0 0'}}>* Geschatte standaard bandenmaat op basis van model en bouwjaar</p>
    </div>
  );
}

export function AIAdvice({ vehicle }: Props) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [torque, setTorque] = useState<string | null>(null);
  const [tireSize, setTireSize] = useState<string | null>(null);
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
          const tireMatch = full.match(/BANDENMAAT:\s*([^\n]+)/);
          if (tireMatch) setTireSize(tireMatch[1].trim());
          const withoutExtracted = full
            .replace(/KOPPELMOMENT:[^\n]+\n?/, "")
            .replace(/BANDENMAAT:[^\n]+\n?/, "")
            .trim();
          setAdvice(withoutExtracted);
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
      {(loading || torque || tireSize) && (
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'14px',overflow:'hidden'}}>
          <div style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb',padding:'10px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
            <span>🔧</span>
            <span style={{fontSize:'12px',fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'0.08em'}}>Technische specificaties (AI)</span>
          </div>
          <div style={{padding:'16px 20px',display:'flex',flexWrap:'wrap',gap:'24px'}}>
            {loading ? (
              <div style={{display:'flex',alignItems:'center',gap:'10px',color:'#6b7280'}}>
                <div style={{width:'16px',height:'16px',border:'2px solid #e5e7eb',borderTopColor:'#6b7280',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
                <span style={{fontSize:'14px'}}>Laden...</span>
              </div>
            ) : (
              <>
                {torque && (
                  <div>
                    <p style={{fontSize:'11px',color:'#9ca3af',margin:'0 0 4px',textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:600}}>Koppelmoment</p>
                    <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>{torque}</span>
                  </div>
                )}
                {tireSize && (
                  <div>
                    <p style={{fontSize:'11px',color:'#9ca3af',margin:'0 0 8px',textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:600}}>Bandenmaat</p>
                    <TireVisual size={tireSize} />
                  </div>
                )}
              </>
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