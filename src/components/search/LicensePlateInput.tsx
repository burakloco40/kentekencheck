"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isValidPlate, normalizePlate } from "@/lib/validation/plate";

interface Props { initialValue?: string; autoFocus?: boolean; size?: "hero" | "compact"; }

export function LicensePlateInput({ initialValue = "", autoFocus = false, size = "hero" }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isHero = size === "hero";

  function handleSearch(plateInput: string) {
    const normalized = normalizePlate(plateInput);
    if (!normalized) {
      setError("Voer een kenteken in.");
      inputRef.current?.focus();
      return;
    }
    if (!isValidPlate(normalized)) {
      setError("Ongeldig kenteken. Probeer bijv. SH-239-S.");
      inputRef.current?.focus();
      return;
    }
setError(null);
    router.push("/voertuig/" + normalized);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    handleSearch(value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(value);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (error) setError(null);
    setValue(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""));
  }

  return (
    <div style={{width:'100%', maxWidth: isHero ? '480px' : '320px'}}>
      <form onSubmit={handleSubmit} noValidate action="#">
        <div style={{
          display:'flex',
          alignItems:'stretch',
          borderRadius:'6px',
          border: error ? '2px solid #ef4444' : '2px solid rgba(212,160,23,0.4)',
          overflow:'hidden',
          boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.15)' : '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          <div style={{background:'#162d58',width: isHero ? '44px' : '34px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'3px',padding:'4px',flexShrink:0}}>
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',width:'18px',gap:'2px'}}>
              {Array.from({length:12}).map((_,i)=>(
                <div key={i} style={{width: isHero ? '3px' : '2px',height: isHero ? '3px' : '2px',borderRadius:'50%',background:'#F5C518'}} />
              ))}
            </div>
            <span style={{fontFamily:'Courier Prime, monospace',fontSize: isHero ? '11px' : '8px',fontWeight:700,color:'white',letterSpacing:'0.05em'}}>NL</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="SH-239-S"
            maxLength={9}
            autoFocus={autoFocus}
            aria-label="Kenteken invoeren"
            style={{
              flex:1,
              background:'#F5C518',
              fontFamily:'Courier Prime, monospace',
              fontWeight:700,
              fontSize: isHero ? '28px' : '16px',
              letterSpacing:'0.15em',
              color:'#0f2040',
              border:'none',
              outline:'none',
              padding: isHero ? '14px 16px' : '10px 12px',
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background:'#162d58',
              color:'white',
              border:'none',
              padding:'0',
              width: isHero ? '56px' : '44px',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              flexShrink:0,
            }}
          >
            {isLoading ? (
              <div style={{width:'20px',height:'20px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
            ) : (
              <svg width={isHero ? 20 : 16} height={isHero ? 20 : 16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
          </button>
        </div>
        {error && <p style={{marginTop:'8px',fontSize:'13px',color:'#ef4444',fontWeight:600}}>{error}</p>}
      </form>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}