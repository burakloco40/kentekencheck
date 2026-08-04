"use client";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

const btnStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  background: '#0070f3',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '10px',
  fontWeight: 700,
  fontSize: '14px',
  textDecoration: 'none',
  marginTop: '12px',
};

export function VehicleHistoryCard({ vehicle }: Props) {
  const affiliateUrl = `https://www.carvertical.deal/2GKDGZK/CT4G5Z/?source_id=AFF&sub1=kentekenrdwcheck&plate=${vehicle.plateRaw}&country=nl`;

  return (
    <div style={{borderRadius:'14px',overflow:'hidden',border:'2px solid #e5e7eb',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
      <div style={{background:'linear-gradient(135deg, #1e3a5f, #2d5a8e)',padding:'16px 20px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontSize:'24px'}}>🔎</span>
        <div>
          <h3 style={{fontSize:'15px',fontWeight:700,color:'white',margin:'0 0 2px'}}>Volledige voertuighistorie</h3>
          <p style={{fontSize:'12px',color:'rgba(255,255,255,0.6)',margin:0}}>Ontdek wat de RDW niet toont</p>
        </div>
      </div>
      <div style={{background:'white',padding:'16px'}}>
        <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
          <img
            src="/BE-NL_160x600.png"
            alt="carVertical — Controleer de echte staat van een auto"
            style={{width:'100%',borderRadius:'8px',display:'block'}}
          />
        </a>
        <div style={{background:'#fff3cd',border:'1px solid #ffc107',borderRadius:'8px',padding:'10px 14px',marginTop:'12px',textAlign:'center'}}>
          <p style={{fontSize:'13px',fontWeight:700,color:'#856404',margin:0}}>🎉 Exclusief 20% korting</p>
          <p style={{fontSize:'12px',color:'#856404',margin:'4px 0 0'}}>Via onze link automatisch toegepast</p>
        </div>
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