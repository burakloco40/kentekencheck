"use client";
import { useState, useEffect } from "react";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

function TireVisual({ size }: { size: string }) {
  const match = size.match(/(\d+)\/(\d+)R(\d+)/);
  if (!match) return <span style={{fontSize:'18px',fontWeight:700,color:'#111827'}}>{size}</span>;
  const width = match[1];
  const height = match[2];
  const rim = match[3];

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'12px'}}>
        <span style={{fontSize:'20px',fontWeight:800,color:'#0f2040'}}>{size}</span>
      </div>
      <div style={{display:'flex',gap:'12px',alignItems:'flex-end'}}>
        {[
          {label:'Breedte', value: width, unit: 'mm'},
          {label:'Hoogte', value: height, unit: '%'},
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

function extractField(text: string, field: string): string | null {
  const match = text.match(new RegExp(`${field}:\\s*([^\\n]+)`));
  return match ? match[1].trim() : null;
}

function SpecCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{background:'#f8fafc',border:'1px solid #e5e7eb',borderRadius:'10px',padding:'12px 14px'}}>
      <div style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'4px'}}>{icon} {label}</div>
      <div style={{fontSize:'14px',fontWeight:700,color:'#111827'}}>{value}</div>
    </div>
  );
}

export function AIAdvice({ vehicle }: Props) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [specs, setSpecs] = useState<Record<string, string>>({});
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

          const extracted: Record<string, string> = {};
          const fields = [
            {key: 'torque', field: 'KOPPELMOMENT'},
            {key: 'drive', field: 'AANDRIJVING'},
            {key: 'timing', field: 'DISTRIBUTIE'},
            {key: 'turbo', field: 'TURBO'},
            {key: 'maintenance', field: 'ONDERHOUDSKOSTEN'},
            {key: 'bestYear', field: 'BESTE_BOUWJAAR'},
            {key: 'marketValue', field: 'MARKTWAARDE'},
            {key: 'depreciation', field: 'AFSCHRIJVING'},
          ];

          let cleaned = full;
          for (const {key, field} of fields) {
            const val = extractField(full, field);
            if (val) {
              extracted[key] = val;
              cleaned = cleaned.replace(new RegExp(`${field}:[^\\n]+\\n?`), '');
            }
          }

          const tire = extractField(full, 'BANDENMAAT');
          if (tire) {
            setTireSize(tire);
            cleaned = cleaned.replace(/BANDENMAAT:[^\n]+\n?/, '');
          }

          setSpecs(extracted);
          setAdvice(cleaned.trim());
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
      <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'14px',overflow:'hidden'}}>
        <div style={{background:'#1e3a5f',padding:'12px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'16px'}}>⚡</span>
          <span style={{fontSize:'13px',fontWeight:700,color:'white',textTransform:'uppercase',letterSpacing:'0.06em'}}>Technische specificaties (AI)</span>
        </div>
        <div style={{padding:'16px'}}>
          {loading ? (
            <div style={{display:'flex',alignItems:'center',gap:'10px',color:'#6b7280'}}>
              <div style={{width:'16px',height:'16px',border:'2px solid #e5e7eb',borderTopColor:'#6b7280',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
              <span style={{fontSize:'14px'}}>Laden...</span>
            </div>
          ) : (
            <>
              {tireSize && (
                <div style={{marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid #f3f4f6'}}>
                  <div style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'8px'}}>🔵 Bandenmaat</div>
                  <TireVisual size={tireSize} />
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'10px'}}>
                {specs.torque && <SpecCard label="Koppelmoment" value={specs.torque} icon="🔧" />}
                {specs.drive && <SpecCard label="Aandrijving" value={specs.drive} icon="⚙️" />}
                {specs.timing && <SpecCard label="Distributie" value={specs.timing} icon="🔩" />}
                {specs.turbo && <SpecCard label="Turbo" value={specs.turbo} icon="💨" />}
                {specs.maintenance && <SpecCard label="Onderhoudskosten/jaar" value={specs.maintenance} icon="🔨" />}
                {specs.bestYear && <SpecCard label="Beste bouwjaar" value={specs.bestYear} icon="⭐" />}
                {specs.marketValue && <SpecCard label="Marktwaarde" value={specs.marketValue} icon="💶" />}
                {specs.depreciation && <SpecCard label="Afschrijving/jaar" value={specs.depreciation} icon="📉" />}
              </div>
            </>
          )}
        </div>
      </div>

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