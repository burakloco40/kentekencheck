import type { Metadata } from "next";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";

export const metadata: Metadata = {
  title: "Kentekencheck — Gratis Nederlands kenteken opzoeken",
  description: "Gratis Nederlands kenteken opzoeken. Bekijk APK, brandstof, vermogen en meer.",
};

export default function HomePage() {
  return (
    <>
      <section style={{background:'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #162d58 100%)',color:'white',padding:'80px 16px 96px'}}>
        <div style={{maxWidth:'760px',margin:'0 auto',textAlign:'center'}}>
          <h1 style={{fontSize:'clamp(36px,6vw,64px)',fontWeight:900,color:'white',margin:'0 0 20px',lineHeight:1.05,letterSpacing:'-1px'}}>
            Kenteken <span style={{color:'#F5C518'}}>opzoeken</span>
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.55)',margin:'0 auto 44px',maxWidth:'420px',lineHeight:1.6}}>
            Voer een Nederlands kenteken in en bekijk direct alle voertuiggegevens uit het RDW register.
          </p>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'20px'}}>
            <LicensePlateInput autoFocus size="hero" />
          </div>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.3)',margin:0}}>
            Probeer bijv.{' '}
            <a href="/voertuig/SH239S" style={{fontFamily:'Courier Prime, monospace',color:'rgba(255,255,255,0.5)',textDecoration:'none',background:'rgba(255,255,255,0.08)',padding:'2px 8px',borderRadius:'4px',border:'1px solid rgba(255,255,255,0.15)'}}>SH-239-S</a>
          </p>
        </div>
      </section>

      <section style={{maxWidth:'1100px',margin:'0 auto',padding:'64px 16px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <h2 style={{fontSize:'28px',fontWeight:800,color:'#0f2040',margin:'0 0 10px'}}>Alles wat je wilt weten</h2>
          <p style={{fontSize:'15px',color:'#6b7280',margin:0}}>Direct beschikbaar via het officiële RDW register</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
          {[
            {icon:'📋',title:'APK en Verzekering',desc:'Bekijk de APK vervaldatum, resterende dagen en of het voertuig WAM verzekerd is.'},
            {icon:'⚙️',title:'Motor en Techniek',desc:'Brandstof, vermogen, cilinderinhoud, motorcode, emissienorm en geluidsniveau.'},
            {icon:'⛽',title:'Brandstofverbruik',desc:'Officieel verbruik gecombineerd, in de stad en op de snelweg.'},
            {icon:'🚗',title:'Voertuiggegevens',desc:'Merk, model, carrosserie, kleur, aantal deuren en zitplaatsen.'},
            {icon:'🔍',title:'APK keuringshistorie',desc:'Bekijk alle APK keuringen met datum en geconstateerde gebreken.'},
            {icon:'🤖',title:'AI Voertuigadvies',desc:'Automatische AI-analyse over betrouwbaarheid, koppelmoment en aandachtspunten.'},
          ].map(f => (
            <div key={f.title} style={{background:'white',border:'1px solid #e5e7eb',borderRadius:'16px',padding:'24px',display:'flex',gap:'16px',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
              <div style={{width:'44px',height:'44px',borderRadius:'12px',background:'#f0f9ff',border:'1px solid #e0f2fe',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',flexShrink:0}}>{f.icon}</div>
              <div>
                <h3 style={{fontSize:'15px',fontWeight:700,color:'#0f2040',margin:'0 0 6px'}}>{f.title}</h3>
                <p style={{fontSize:'13px',color:'#6b7280',lineHeight:'1.6',margin:0}}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{background:'#f9fafb',borderTop:'1px solid #e5e7eb',padding:'64px 16px'}}>
        <div style={{maxWidth:'720px',margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'28px',fontWeight:800,color:'#0f2040',margin:'0 0 16px'}}>Hoe werkt het?</h2>
          <p style={{fontSize:'15px',color:'#6b7280',lineHeight:'1.8',margin:'0 0 32px'}}>
            Voer een geldig Nederlands kenteken in. Onze service raadpleegt direct het officiële{' '}
            <a href="https://opendata.rdw.nl" target="_blank" rel="noopener noreferrer" style={{color:'#0284c7',textDecoration:'none',fontWeight:600}}>RDW Open Data register</a>{' '}
            en toont alle beschikbare voertuiggegevens. De informatie is openbaar en wordt niet opgeslagen.
          </p>
        </div>
      </section>
    </>
  );
}