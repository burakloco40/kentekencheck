import type { Metadata } from "next";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";

export const metadata: Metadata = {
  title: "Kentekencheck — Gratis Nederlands kenteken opzoeken",
  description: "Gratis Nederlands kenteken opzoeken.",
};

export default function HomePage() {
  return (
    <main>
      <section style={{background:'linear-gradient(135deg, #0a1628 0%, #0f2040 50%, #162d58 100%)',color:'white',padding:'80px 16px'}}>
        <div style={{maxWidth:'760px',margin:'0 auto',textAlign:'center'}}>
          <h1 style={{fontSize:'clamp(36px,6vw,64px)',fontWeight:900,color:'white',margin:'0 0 20px',lineHeight:1.05}}>
            Kenteken <span style={{color:'#F5C518'}}>opzoeken</span>
          </h1>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.55)',margin:'0 auto 44px',maxWidth:'420px',lineHeight:1.6}}>
            Voer een Nederlands kenteken in en bekijk direct alle voertuiggegevens.
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
    </main>
  );
}