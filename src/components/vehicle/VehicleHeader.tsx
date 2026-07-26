"use client";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

const btnStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  background: '#F5C518',
  color: '#0f2040',
  padding: '12px 24px',
  borderRadius: '10px',
  fontWeight: 700,
  fontSize: '14px',
  textDecoration: 'none',
};

export function VehicleHistoryCard({ vehicle }: Props) {
  const affiliateUrl = `https://www.carvertical.com/nl/check?referral=JOUW_AFFILIATE_CODE&plate=${vehicle.plateRaw}&country=nl`;

  return (
    <div style={{borderRadius:'14px',overflow:'hidden',border:'2px solid #e5e7eb',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
      <div style={{background:'linear-gradient(135deg, #1e3a5f, #2d5a8e)',padding:'16px 20px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'24px'}}>🔎</span>
        <div>
          <h3 style={{fontSize:'15px',fontWeight:700,color:'white',margin:'0 0 2px'}}>Volledige voertuighistorie</h3>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',margin:0}}>Ontdek wat de RDW niet toont</p>
        </div>
      </div>
      <div style={{background:'white',padding:'20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'20px'}}>
          {[
            {icon:'💥', label:'Schadehistorie'},
            {icon:'📍', label:'Kilometerstand verificatie'},
            {icon:'🌍', label:'Internationale geschiedenis'},
            {icon:'👤', label:'Aantal vorige eigenaren'},
            {icon:'🔧', label:'Onderhoudshistorie'},
            {icon:'🚨', label:'Gestolen voertuig check'},
          ].map(item => (
            <div key={item.label} style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{fontSize:'16px'}}>{item.icon}</span>
              <span style={{fontSize:'13px',color:'#374151',fontWeight:500}}>{item.label}</span>
            </div>
          ))}
        </div>
        <p style={{fontSize:'12px',color:'#9ca3af',margin:'0 0 16px',lineHeight:'1.6'}}>
          De gratis RDW data geeft een goed beeld, maar voor een complete voertuighistorie raden wij een rapport aan via carVertical.
        </p>
        <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          Bekijk volledige voertuighistorie
        </a>
        <p style={{fontSize:'11px',color:'#9ca3af',textAlign:'center',margin:'8px 0 0'}}>
          Aangeboden door carVertical
        </p>
      </div>
    </div>
  );
}