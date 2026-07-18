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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882l6.2-1.626A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.359-.214-3.721.976.993-3.62-.234-.372A9.818 9.818 0 1112 21.818z"/>
        </svg>
        WhatsApp
      </button>

      <button
        onClick={handleCopy}
        style={{display:'flex',alignItems:'center',gap:'6px',padding:'8px 16px',background: copied ? '#16a34a' : 'white',color: copied ? 'white' : '#374151',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'13px',fontWeight:600,cursor:'pointer',transition:'all 0.2s'}}
      >
        {copied ? (
          <>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Gekopieerd!
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Kopieer link
          </>
        )}
      </button>
    </div>
  );
}