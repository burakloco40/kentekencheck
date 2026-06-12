import type { Metadata } from "next";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";

export const metadata: Metadata = {
  title: "Kentekencheck — Voertuiggegevens opzoeken",
  description: "Gratis Nederlands kenteken opzoeken. Bekijk APK, brandstof, vermogen en meer.",
};

const STATS = [
  { number: "10M+", label: "Voertuigen in register" },
  { number: "100%", label: "Officiële RDW data" },
  { number: "Gratis", label: "Altijd en voor iedereen" },
];

const FEATURES = [
  { icon: "🔍", title: "Kenteken opzoeken", desc: "Voer elk Nederlands kenteken in en krijg direct alle beschikbare gegevens." },
  { icon: "📋", title: "APK & Verzekering", desc: "Bekijk de APK vervaldatum en of het voertuig WAM verzekerd is." },
  { icon: "⚡", title: "Motor & Techniek", desc: "Brandstof, vermogen, cilinderinhoud, CO2 uitstoot en meer." },
  { icon: "⚖️", title: "Gewicht & Prijs", desc: "Leeg gewicht, rijklaar gewicht en de originele catalogusprijs." },
  { icon: "🤖", title: "AI Voertuigadvies", desc: "Ontvang een automatische AI-analyse over betrouwbaarheid en aandachtspunten." },
  { icon: "🔒", title: "Privacy vriendelijk", desc: "Wij slaan geen kentekens op. Alle data komt rechtstreeks van de RDW." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{background:'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #162d58 100%)',color:'white',padding:'72px 16px 80px'}}>
        <div style={{maxWidth:'760px',margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 16px',background:'rgba(245,197,24,0.15)',border:'1px solid rgba(245,197,24,0.3)',borderRadius:'999px',fontSize:'12px',fontWeight:600,color:'#F5C518',marginBottom:'28px',letterSpacing:'0.05em'}}>
            GRATIS · OFFICIËLE RDW DATA
          </div>
          <h1 style={{fontSize:'clamp(36px,6vw,64px)',fontWeight:900,color:'white',marginBottom:'20px',lineHeight:1.05,letterSpacing:'-1px'}}>
            Kenteken <span style={{color:'#F5C518'}}>opzoeken</span>
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.55)',marginBottom:'44px',maxWidth:'420px',margin:'0 auto 44px',lineHeight:1.6}}>
            Voer een Nederlands kenteken in en bekijk direct alle voertuiggegevens uit het officiële RDW register.
          </p>
          <div style={{display:'flex',justifyContent:'center',marginBottom:'20px'}}>
            <LicensePlateInput autoFocus size="hero" />
          </div>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.3)',margin:0}}>
            Probeer bijv.{' '}
            <a href="/voertuig/SH239S" style={{fontFamily:'Courier Prime, monospace',color:'rgba(255,255,255,0.5)',textDecoration:'none',background:'rgba(255,255,255,0.08)',padding:'2px 8px',borderRadius:'4px',border:'1px solid rgba(255,255,255,0.15)'}}>SH-239-S</a>
          </p>
        </div>

        {/* Stats */}
        <div style={{maxWidth:'760px',margin:'48px auto 0',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(255,255,255,0.1)',borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.1)'}}>
          {STATS.map(s => (
            <div key={s.number} style={{padding:'20px 16px',textAlign:'center',background:'rgba(255,255,255,0.04)'}}>
              <div style={{fontSize:'24px',fontWeight:800,color:'#F5C518',marginBottom:'4px'}}>{s.number}</div>
              <div style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:'1100px',margin:'0 auto',padding:'64px 16px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <h2 style={{fontSize:'28px',fontWeight:800,color:'#0f2040',marginBottom:'10px',margin:'0 0 10px'}}>Alles wat je wilt weten</h2>
          <p style={{fontSize:'15px',color:'#6b7280',margin:0}}>Direct beschikbaar via het officiële RDW register</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
          {FEATURES.map(f => (
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

      {/* Hoe werkt het */}
      <section style={{background:'#f9fafb',borderTop:'1px solid #e5e7eb',borderBottom:'1px solid #e5e7eb',padding:'64px 16px'}}>
        <div style={{maxWidth:'720px',margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'28px',fontWeight:800,color:'#0f2040',margin:'0 0 16px'}}>Hoe werkt het?</h2>
          <p style={{fontSize:'15px',color:'#6b7280',lineHeight:'1.8',margin:'0 0 32px'}}>
            Voer een geldig Nederlands kenteken in het zoekveld in. Onze service raadpleegt direct het officiële{' '}
            <a href="https://opendata.rdw.nl" target="_blank" rel="noopener noreferrer" style={{color:'#0284c7',textDecoration:'none',fontWeight:600}}>RDW Open Data register</a>{' '}
            en toont alle beschikbare voertuiggegevens. De informatie is openbaar beschikbaar en wordt door ons niet opgeslagen.
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:'12px',flexWrap:'wrap'}}>
            {['Voer kenteken in','RDW wordt geraadpleegd','Direct resultaat'].map((step, i) => (
              <div key={step} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'#0f2040',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:700,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>{step}</span>
                {i < 2 && <span style={{color:'#d1d5db',fontSize:'18px'}}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}