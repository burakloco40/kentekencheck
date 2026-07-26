"use client";
import { useState } from "react";

interface Props {
  plate: string;
  brand: string;
  model: string;
}

export function ShareButtons({ plate, brand, model }: Props) {
  const [copied, setCopied] = useState(false);
  const url = `https://kentekenrdwcheck.nl/voertuig/${plate.replace(/-/g, "")}`;
  const text = `Bekijk de voertuiggegevens van ${brand} ${model} (${plate}) op Kentekencheck:`;

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
  }

  return (
    <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
      <button
        onClick={handleWhatsApp}
        style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 16px',background:'#25D366',color:'white',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:600,cursor:'pointer'}}
      >
        WhatsApp
      </button>
      <button
        onClick={handleCopy}
        style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 16px',background: copied ? '#16a34a' : 'white',color: copied ? 'white' : '#374151',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'13px',fontWeight:600,cursor:'pointer'}}
      >
        {copied ? 'Gekopieerd!' : 'Kopieer link'}
      </button>
    </div>
  );
}