"use client";
import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

const btnStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  background: '#0070f3',
  color: 'white',
  padding: '10px 16px',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '13px',
  textDecoration: 'none',
  marginTop: '10px',
};

export function VehicleHistoryCard({ vehicle }: Props) {
  const affiliateUrl = `https://www.carvertical.deal/2GKDGZK/CT4G5Z/?source_id=AFF&sub1=kentekenrdwcheck&plate=${vehicle.plateRaw}&country=nl`;

  return (
    <div style={{borderRadius:'12px',overflow:'hidden',border:'2px solid #e5e7eb',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
      <div style={{background:'#1e3a5f',padding:'10px 12px'}}>
        <h3 style={{fontSize:'12px',fontWeight:700,color:'white',margin:'0 0 2px',lineHeight:'1.4'}}>Volledige voertuighistorie</h3>
        <p style={{fontSize:'11px',color:'rgba(255,255,255,0.6)',margin:0,lineHeight:'1.3'}}>Ontdek wat de RDW niet toont</p>
      </div>
      <div style={{background:'white',padding:'12px'}}>
        <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
          <img
            src="/BE-NL_160x600.png"
            alt="carVertical"
            style={{width:'100%',borderRadius:'6px',display:'block'}}
          />
        </a>
        <div style={{background:'#fff3cd',border:'1px solid #ffc107',borderRadius:'6px',padding:'8px 10px',marginTop:'10px',textAlign:'center'}}>
          <p style={{fontSize:'12px',fontWeight:700,color:'#856404',margin:0}}>🎉 Exclusief 20% korting</p>
          <p style={{fontSize:'11px',color:'#856404',margin:'3px 0 0',lineHeight:'1.3'}}>Via onze link automatisch toegepast</p>
        </div>
        <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          Bekijk voertuighistorie
        </a>
        <p style={{fontSize:'10px',color:'#9ca3af',textAlign:'center',margin:'6px 0 0'}}>
          Aangeboden door carVertical
        </p>
      </div>
    </div>
  );
}