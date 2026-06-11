import type { VehicleData } from "@/types/vehicle";
import { formatPrice } from "@/lib/utils/formatters";
import { AIAdvice } from "./AIAdvice";

interface Props { vehicle: VehicleData; }

function Field({ label, value, unit, highlight }: {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  highlight?: boolean;
}) {
  const display = (value !== null && value !== undefined && String(value).trim() !== "") ? String(value) : null;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'4px',padding:'14px',background:'#ffffff',borderRadius:'10px',border:'1px solid #e5e7eb'}}>
      <span style={{fontSize:'11px',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:'#9ca3af'}}>{label}</span>
      {display ? (
        <span style={{fontSize:highlight?'18px':'15px',fontWeight:700,color:highlight?'#0f2040':'#1f2937'}}>
          {display}{unit && <span style={{fontSize:'12px',fontWeight:400,color:'#9ca3af',marginLeft:'3px'}}>{unit}</span>}
        </span>
      ) : (
        <span style={{fontSize:'13px',color:'#d1d5db',fontStyle:'italic'}}>—</span>
      )}
    </div>
  );
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div style={{borderRadius:'14px',overflow:'hidden',border:'1px solid #e5e7eb'}}>
      <div style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb',padding:'10px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
        <span>{emoji}</span>
        <span style={{fontSize:'12px',fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'0.08em'}}>{title}</span>
      </div>
      <div style={{background:'#f9fafb',padding:'12px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'10px'}}>
        {children}
      </div>
    </div>
  );
}

export function VehicleDataGrid({ vehicle }: Props) {
  const apkDagen = vehicle.apkDaysRemaining;
  const apkTekst = vehicle.apkStatus === "expired"
    ? "VERLOPEN"
    : vehicle.apkStatus === "valid" && apkDagen !== null
      ? apkDagen + " dagen resterend"
      : "Onbekend";

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>

      <Section title="Voertuig" emoji="🚗">
        <Field label="Merk" value={vehicle.brand} highlight />
        <Field label="Model" value={vehicle.model} highlight />
        <Field label="Type" value={vehicle.vehicleType} />
        <Field label="Carrosserie" value={vehicle.bodyStyle} />
        <Field label="Kleur" value={vehicle.primaryColor} />
        {vehicle.secondaryColor && <Field label="2e kleur" value={vehicle.secondaryColor} />}
        <Field label="Deuren" value={vehicle.numberOfDoors} />
        <Field label="Zitplaatsen" value={vehicle.numberOfSeats} />
        <Field label="Eerste toelating" value={vehicle.firstAdmissionDateNL} />
      </Section>

      <Section title="Motor & Techniek" emoji="⚙️">
        <Field label="Brandstof" value={vehicle.fuelType} highlight />
        <Field label="Vermogen" value={vehicle.powerHP} unit="pk" highlight />
        <Field label="Vermogen" value={vehicle.powerKW} unit="kW" />
        <Field label="Cilinderinhoud" value={vehicle.engineDisplacement} unit="cc" />
        <Field label="CO₂ uitstoot" value={vehicle.co2Emission} unit="g/km" />
      </Section>

      <Section title="Gewicht & Afmetingen" emoji="⚖️">
        <Field label="Leeg gewicht" value={vehicle.massEmpty} unit="kg" />
        <Field label="Rijklaar gewicht" value={vehicle.massRijklaar} unit="kg" />
        <Field label="Max. toegestane massa" value={vehicle.massMax} unit="kg" />
      </Section>

      <Section title="Financieel" emoji="💶">
        <Field label="Catalogusprijs" value={vehicle.catalogPrice ? formatPrice(vehicle.catalogPrice) : null} highlight />
      </Section>

      <Section title="APK & Verzekering" emoji="📋">
        <Field label="APK vervaldatum" value={vehicle.apkExpiryDateNL} highlight />
        <Field label="APK resterende dagen" value={apkTekst} />
        <Field label="WAM verzekerd" value={vehicle.insuranceStatus === "insured" ? "Ja ✓" : vehicle.insuranceStatus === "not_insured" ? "Nee ✗" : "Onbekend"} />
      </Section>

      <AIAdvice vehicle={vehicle} />

      <p style={{textAlign:'center',fontSize:'11px',color:'#9ca3af',padding:'4px 0 8px'}}>
        Gegevens afkomstig van RDW Open Data · {new Date(vehicle.fetchedAt).toLocaleString("nl-NL")}
      </p>
    </div>
  );
}