import type { Metadata } from "next";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";

export const metadata: Metadata = {
  title: "Kentekencheck — Voertuiggegevens opzoeken",
  description: "Gratis Nederlands kenteken opzoeken.",
};

export default function HomePage() {
  return (
    <>
      <section style={{background:'linear-gradient(to bottom, #0f2040, #162d58, #1e3a6e)',color:'white',padding:'80px 16px'}}>
        <div style={{maxWidth:'800px',margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 16px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'999px',fontSize:'12px',color:'rgba(255,255,255,0.8)',marginBottom:'24px'}}>
            <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ade80',display:'inline-block'}} />
            Gratis · Officiële RDW data
          </div>
          <h1 style={{fontSize:'clamp(36px,6vw,60px)',fontWeight:800,color:'white',marginBottom:'16px',lineHeight:1.1}}>
            Kenteken <span style={{color:'#F5C518'}}>opzoeken</span>
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.6)',marginBottom:'40px',maxWidth:'400px',margin:'0 auto 40px'}}>
            Voer een Nederlands kenteken in en bekijk direct alle voertuiggegevens.
          </p>
          <div style={{display:'flex',justifyContent:'center'}}>
            <LicensePlateInput autoFocus size="hero" />
          </div>
          <div style={{marginTop:'20px'}}>
            <span style={{fontSize:'12px',color:'rgba(255,255,255,0.3)'}}>Voorbeeld: </span>
            <a href="/voertuig/SH239S" style={{fontFamily:'Courier Prime, monospace',fontSize:'12px',padding:'4px 10px',background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'4px',color:'rgba(255,255,255,0.7)',textDecoration:'none'}}>SH-239-S</a>
          </div>
        </div>
      </section>

      <section style={{maxWidth:'1000px',margin:'0 auto',padding:'60px 16px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'20px'}}>
          {[
            {icon:'✓',title:'APK-status',desc:'Geldig of verlopen, inclusief vervaldatum en resterende dagen'},
            {icon:'⚙️',title:'Voertuiggegevens',desc:'Merk, model, brandstof, vermogen, gewicht en meer'},
            {icon:'⚡',title:'Direct resultaat',desc:'Rechtstreeks uit het officiële RDW register'},
          ].map(f => (
            <div key={f.title} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',display:'flex',gap:'16px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'#f0f9ff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',flexShrink:0}}>{f.icon}</div>
              <div>
                <h3 style={{fontSize:'15px',fontWeight:700,color:'#0f2040',marginBottom:'4px',margin:'0 0 4px'}}>{f.title}</h3>
                <p style={{fontSize:'13px',color:'#6b7280',lineHeight:'1.5',margin:0}}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{maxWidth:'1000px',margin:'0 auto',padding:'0 16px 60px'}}>
        <div style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'32px'}}>
          <h2 style={{fontSize:'20px',fontWeight:700,color:'#0f2040',marginBottom:'12px',margin:'0 0 12px'}}>Hoe werkt het?</h2>
          <p style={{fontSize:'14px',color:'#6b7280',lineHeight:'1.7',margin:0}}>
            Voer een geldig Nederlands kenteken in. Onze service raadpleegt het officiële{' '}
            <a href="https://opendata.rdw.nl" target="_blank" rel="noopener noreferrer" style={{color:'#0284c7'}}>RDW Open Data register</a>{' '}
            en toont direct de beschikbare voertuiggegevens. De informatie is openbaar beschikbaar en wordt niet bewaard.
          </p>
        </div>
      </section>
    </>
  );
}