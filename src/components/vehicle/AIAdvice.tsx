"use client";
import { useState, useEffect } from "react";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

function TireVisual({ size, label }: { size: string; label: string }) {
  const match = size.match(/(\d+)\/(\d+)R(\d+)/);
  if (!match) return null;
  const width = match[1];
  const height = match[2];
  const rim = match[3];

  return (
    <div>
      <div style={{fontSize:'12px',color:'#6b7280',fontWeight:600,marginBottom:'6px'}}>{label}</div>
      <div style={{marginBottom:'8px'}}>
        <span style={{fontSize:'16px',fontWeight:800,color:'#0f2040'}}>{size}</span>
      </div>
      <div style={{display:'flex',gap:'8px',alignItems:'flex-end'}}>
        {[
          {label:'Breedte', value: width, unit: 'mm'},
          {label:'Hoogte', value: height, unit: '%'},
          {label:'Velg', value: `R${rim}`, unit: ''},
        ].map(item => (
          <div key={item.label} style={{textAlign:'center'}}>
            <div style={{background:'#F5C518',color:'#0f2040',borderRadius:'6px',padding:'3px 8px',fontWeight:700,fontSize:'12px',marginBottom:'3px'}}>
              {item.value}{item.unit}
            </div>
            <div style={{fontSize:'10px',color:'#6b7280'}}>{item.label}</div>
          </div>
        ))}
      </div>
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

function ServiceRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{display:'flex',alignItems:'center',padding:'10px 0',borderBottom:'1px solid #f3f4f6'}}>
      <span style={{width:'50%',fontSize:'13px',color:'#6b7280',fontWeight:500}}>{label}</span>
      <span style={{fontSize:'13px',color:'#111827',fontWeight:600}}>{value}</span>
    </div>
  );
}

export function AIAdvice({ vehicle }: Props) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [tireFront, setTireFront] = useState<string | null>(null);
  const [tireRear, setTireRear] = useState<string | null>(null);
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
          const fields = [
            {key: 'torque', field: 'KOPPELMOMENT'},
            {key: 'drive', field: 'AANDRIJVING'},
            {key: 'turbo', field: 'TURBO'},
            {key: 'baggage', field: 'BAGAGERUIMTE'},
            {key: 'topspeed', field: 'TOPSNELHEID'},
            {key: 'acceleration', field: 'NULHONDERD'},
            {key: 'oiltype', field: 'OLIETYPE'},
            {key: 'oilcapacity', field: 'OLIECAPACITEIT'},
            {key: 'oilinterval', field: 'OLIEVERVERSING'},
            {key: 'maintenance', field: 'ONDERHOUDSKOSTEN'},
            {key: 'facelift', field: 'FACELIFT'},
            {key: 'depreciation', field: 'AFSCHRIJVING'},
          ];

          const extracted: Record<string, string> = {};
          let cleaned = full;

          for (const {key, field} of fields) {
            const val = extractField(full, field);
            if (val) {
              extracted[key] = val;
              cleaned = cleaned.replace(new RegExp(`${field}:[^\\n]+\\n?`), '');
            }
          }

          const front = extractField(full, 'BANDENMAAT_VOOR');
          const rear = extractField(full, 'BANDENMAAT_ACHTER');
          if (front) {
            setTireFront(front);
            cleaned = cleaned.replace(/BANDENMAAT_VOOR:[^\n]+\n?/, '');
          }
          if (rear && rear.toUpperCase() !== 'ZELFDE') {
            setTireRear(rear);
            cleaned = cleaned.replace(/BANDENMAAT_ACHTER:[^\n]+\n?/, '');
          } else {
            cleaned = cleaned.replace(/BANDENMAAT_ACHTER:[^\n]+\n?/, '');
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

  const showTires = tireFront !== null;
  const differentRear = tireRear !== null && tireRear !== tireFront;
  const hasServiceData = specs.oiltype || specs.oilcapacity || specs.oilinterval || specs.maintenance;
  const hasPerformance = specs.topspeed || specs.acceleration;

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
              {showTires && (
                <div style={{marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid #f3f4f6'}}>
                  <div style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'12px'}}>🔵 Bandenmaten</div>
                  <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
                    <TireVisual size={tireFront!} label={differentRear ? "Voorbanden" : "Voor- en achterbanden"} />
                    {differentRear && tireRear && (
                      <TireVisual size={tireRear} label="Achterbanden" />
                    )}
                  </div>
                  <p style={{fontSize:'11px',color:'#9ca3af',margin:'10px 0 0'}}>* Geschatte standaard bandenmaten op basis van model en bouwjaar</p>
                </div>
              )}

              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'10px',marginBottom:'16px'}}>
                {specs.torque && <SpecCard label="Koppelmoment" value={specs.torque} icon="🔧" />}
                {specs.drive && <SpecCard label="Aandrijving" value={specs.drive} icon="⚙️" />}
                {specs.turbo && <SpecCard label="Turbo" value={specs.turbo} icon="💨" />}
                {specs.baggage && <SpecCard label="Bagageruimte" value={specs.baggage} icon="🧳" />}
                {specs.facelift && <SpecCard label="Facelift" value={specs.facelift} icon="✨" />}
                {specs.depreciation && <SpecCard label="Afschrijving/jaar" value={specs.depreciation} icon="📉" />}
              </div>

              {hasPerformance && (
                <div style={{marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid #f3f4f6'}}>
                  <div style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'8px'}}>🏎️ Prestaties</div>
                  {specs.topspeed && <ServiceRow label="Topsnelheid" value={specs.topspeed} />}
                  {specs.acceleration && <ServiceRow label="0-100 km/h" value={specs.acceleration} />}
                </div>
              )}

              {hasServiceData && (
                <div>
                  <div style={{fontSize:'11px',color:'#9ca3af',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'8px'}}>🔩 Service en vloeistoffen</div>
                  {specs.oiltype && <ServiceRow label="Type motorolie" value={specs.oiltype} />}
                  {specs.oilcapacity && <ServiceRow label="Oliecapaciteit" value={specs.oilcapacity} />}
                  {specs.oilinterval && <ServiceRow label="Olieverversing" value={specs.oilinterval} />}
                  {specs.maintenance && <ServiceRow label="Onderhoudskosten/jaar" value={specs.maintenance} />}
                </div>
              )}
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