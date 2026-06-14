import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

export function VehicleHeader({ vehicle }: Props) {
  const apkBg = vehicle.apkStatus === "expired" ? "#fef2f2" : "#f0fdf4";
  const apkBorder = vehicle.apkStatus === "expired" ? "#fca5a5" : "#86efac";
  const apkText = vehicle.apkStatus === "expired" ? "#991b1b" : "#166534";
  const apkLabel = vehicle.apkStatus === "expired" ? "✕ APK verlopen" : vehicle.apkStatus === "valid" ? "✓ APK geldig" : "– APK onbekend";

  const insBg = vehicle.insuranceStatus === "insured" ? "#f0fdf4" : vehicle.insuranceStatus === "not_insured" ? "#fef2f2" : "#f9fafb";
  const insBorder = vehicle.insuranceStatus === "insured" ? "#86efac" : vehicle.insuranceStatus === "not_insured" ? "#fca5a5" : "#e5e7eb";
  const insText = vehicle.insuranceStatus === "insured" ? "#166534" : vehicle.insuranceStatus === "not_insured" ? "#991b1b" : "#6b7280";
  const insLabel = vehicle.insuranceStatus === "insured" ? "✓ WAM verzekerd" : vehicle.insuranceStatus === "not_insured" ? "✕ Niet verzekerd" : "– Verzekering onbekend";

  return (
    <div style={{background:'#0f2040',borderRadius:'16px',padding:'24px 28px',color:'white'}}>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'flex-start',gap:'20px'}}>
        <div style={{flex:1,minWidth:'240px'}}>
          <p style={{fontSize:'11px',fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.45)',margin:'0 0 6px 0'}}>{vehicle.vehicleType}</p>
          <h1 style={{fontSize:'32px',fontWeight:800,color:'white',margin:'0 0 4px 0',lineHeight:1.1}}>
            {vehicle.brand} <span style={{color:'#F5C518'}}>{vehicle.model}</span>
          </h1>
          {vehicle.bodyStyle && vehicle.bodyStyle !== "Onbekend" && (
            <p style={{fontSize:'14px',color:'rgba(255,255,255,0.45)',margin:'0 0 16px 0'}}>
              {vehicle.bodyStyle}{vehicle.firstAdmissionDateNL ? " · " + vehicle.firstAdmissionDateNL : ""}
            </p>
          )}

          <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'20px'}}>
            <span style={{fontSize:'12px',fontWeight:700,padding:'5px 12px',borderRadius:'20px',border:'2px solid '+apkBorder,background:apkBg,color:apkText}}>{apkLabel}</span>
            <span style={{fontSize:'12px',fontWeight:700,padding:'5px 12px',borderRadius:'20px',border:'2px solid '+insBorder,background:insBg,color:insText}}>{insLabel}</span>
            {vehicle.hasRecallAction && (
              <span style={{fontSize:'12px',fontWeight:700,padding:'5px 12px',borderRadius:'20px',border:'2px solid #fca5a5',background:'#fef2f2',color:'#991b1b'}}>⚠ Openstaande terugroepactie</span>
            )}
            {vehicle.isExported && (
              <span style={{fontSize:'12px',fontWeight:700,padding:'5px 12px',borderRadius:'20px',border:'2px solid #e5e7eb',background:'#f9fafb',color:'#6b7280'}}>Geëxporteerd</span>
            )}
          </div>

          <div style={{display:'flex',flexWrap:'wrap',gap:'24px'}}>
            {vehicle.powerHP && (
              <div>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:'0 0 2px 0',textTransform:'uppercase',letterSpacing:'0.08em'}}>Vermogen</p>
                <p style={{fontSize:'22px',fontWeight:800,color:'white',margin:0}}>{vehicle.powerHP} <span style={{fontSize:'13px',fontWeight:400,color:'rgba(255,255,255,0.5)'}}>pk</span></p>
              </div>
            )}
            {vehicle.fuelType && (
              <div>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:'0 0 2px 0',textTransform:'uppercase',letterSpacing:'0.08em'}}>Brandstof</p>
                <p style={{fontSize:'22px',fontWeight:800,color:'white',margin:0}}>{vehicle.fuelType}</p>
              </div>
            )}
            {vehicle.engineDisplacement && (
              <div>
                <p style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:'0 0 2px 0',textTransform:'uppercase',letterSpacing:'0.08em'}}>Cilinderinhoud</p>
                <p style={{fontSize:'22px',fontWeight:800,color:'white',margin:0}}>{vehicle.engineDisplacement} <span style={{fontSize:'13px',fontWeight:400,color:'rgba(255,255,255,0.5)'}}>cc</span></p>
              </div>
            )}
          </div>
        </div>

        <div style={{flexShrink:0}}>
          <div style={{display:'inline-flex',borderRadius:'6px',border:'2px solid rgba(212,160,23,0.4)',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.3)'}}>
            <div style={{background:'#162d58',width:'36px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'4px',padding:'4px'}}>
              <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',width:'18px',gap:'2px'}}>
                {Array.from({length:12}).map((_,i)=>(
                  <div key={i} style={{width:'3px',height:'3px',borderRadius:'50%',background:'#F5C518'}} />
                ))}
              </div>
              <span style={{fontFamily:'Courier Prime, monospace',fontSize:'9px',fontWeight:700,color:'white',letterSpacing:'0.05em'}}>NL</span>
            </div>
            <div style={{background:'#F5C518',padding:'8px 20px',display:'flex',alignItems:'center'}}>
              <span style={{fontFamily:'Courier Prime, monospace',fontSize:'24px',fontWeight:700,color:'#0f2040',letterSpacing:'0.15em'}}>{vehicle.plate}</span>
            </div>
          </div>
          {vehicle.lastRegistrationDateNL && (
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',textAlign:'center',margin:'8px 0 0',fontWeight:500}}>
              Tenaamstelling: {vehicle.lastRegistrationDateNL}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}