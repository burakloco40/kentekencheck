"use client";
import type { VehicleData } from "@/types/vehicle";
import { formatPrice } from "@/lib/utils/formatters";
import { AIAdvice } from "./AIAdvice";
import { APKHistory } from "./APKHistory";
import { RecallActions } from "./RecallActions";

interface Props { vehicle: VehicleData; }

function Row({ label, value, unit }: {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
}) {
  const display = (value !== null && value !== undefined && String(value).trim() !== "") ? String(value) : null;
  if (!display) return null;
  return (
    <div style={{display:'flex',alignItems:'center',padding:'10px 16px',borderBottom:'1px solid #f3f4f6'}}>
      <span style={{width:'45%',fontSize:'13px',color:'#6b7280',fontWeight:500,flexShrink:0}}>{label}</span>
      <span style={{fontSize:'13px',color:'#111827',fontWeight:600}}>
        {display}{unit && <span style={{fontSize:'12px',fontWeight:400,color:'#9ca3af',marginLeft:'3px'}}>{unit}</span>}
      </span>
    </div>
  );
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div style={{borderRadius:'14px',overflow:'hidden',border:'1px solid #e5e7eb',background:'white'}}>
      <div style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb',padding:'12px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
        <span>{emoji}</span>
        <span style={{fontSize:'13px',fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'0.06em'}}>{title}</span>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export function VehicleDataGrid({ vehicle }: Props) {
  const apkDagen = vehicle.apkDaysRemaining;
  const apkTekst = vehicle.apkStatus === "expired"
    ? "Verlopen"
    : vehicle.apkStatus === "valid" && apkDagen !== null
      ? `Geldig — ${apkDagen} dagen resterend`
      : "Onbekend";

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>

      {vehicle.hasRecallAction && (
        <RecallActions actions={vehicle.recallActions} />
      )}

      <Section title="Voertuig" emoji="🚗">
        <Row label="Merk" value={vehicle.brand} />
        <Row label="Model" value={vehicle.model} />
        <Row label="Voertuigsoort" value={vehicle.vehicleType} />
        <Row label="Carrosserie" value={vehicle.bodyStyle} />
        <Row label="Kleur" value={vehicle.primaryColor} />
        {vehicle.secondaryColor && <Row label="2e kleur" value={vehicle.secondaryColor} />}
        <Row label="Aantal deuren" value={vehicle.numberOfDoors} />
        <Row label="Aantal zitplaatsen" value={vehicle.numberOfSeats} />
        <Row label="EU categorie" value={vehicle.europeanCategory} />
        <Row label="Eerste toelating" value={vehicle.firstAdmissionDateNL} />
        <Row label="Eerste NL registratie" value={vehicle.firstRegistrationNLDateNL} />
        <Row label="Laatste tenaamstelling" value={vehicle.lastRegistrationDateNL} />
        <Row label="Herkomst" value={vehicle.isImport ? "Import" : "Nederlands gekentekend"} />
        {vehicle.isExported && <Row label="Export" value="Ja — geëxporteerd" />}
        {vehicle.isTaxi && <Row label="Taxi" value="Ja" />}
      </Section>

      <Section title="Motor en Techniek" emoji="⚙️">
        <Row label="Brandstof" value={vehicle.fuelType} />
        <Row label="Vermogen" value={vehicle.powerHP} unit="pk" />
        <Row label="Vermogen" value={vehicle.powerKW} unit="kW" />
        <Row label="Koppelmoment" value={vehicle.torque} unit="Nm" />
        <Row label="Cilinderinhoud" value={vehicle.engineDisplacement} unit="cc" />
        <Row label="Aantal cilinders" value={vehicle.numberOfCylinders} />
        <Row label="Motorcode" value={vehicle.engineCode} />
        <Row label="Variant" value={vehicle.variant} />
        <Row label="CO2 uitstoot" value={vehicle.co2Emission} unit="g/km" />
        <Row label="Emissienorm" value={vehicle.emissionLevel} />
        <Row label="Energielabel" value={vehicle.energyLabel} />
        <Row label="Geluidsniveau" value={vehicle.soundLevel} unit="dB" />
      </Section>

      <Section title="Brandstofverbruik" emoji="⛽">
        <Row label="Gecombineerd" value={vehicle.fuelConsumptionCombined} unit="l/100km" />
        <Row label="Stad" value={vehicle.fuelConsumptionCity} unit="l/100km" />
        <Row label="Snelweg" value={vehicle.fuelConsumptionHighway} unit="l/100km" />
      </Section>

      <Section title="Gewicht en Afmetingen" emoji="⚖️">
        <Row label="Leeg gewicht" value={vehicle.massEmpty} unit="kg" />
        <Row label="Rijklaar gewicht" value={vehicle.massRijklaar} unit="kg" />
        <Row label="Max. toegestane massa" value={vehicle.massMax} unit="kg" />
        <Row label="Trekgewicht ongeremd" value={vehicle.towWeightUnbraked} unit="kg" />
        <Row label="Trekgewicht geremd" value={vehicle.towWeightBraked} unit="kg" />
        <Row label="Wielbasis" value={vehicle.wheelbase} unit="cm" />
      </Section>

      <Section title="Financieel" emoji="💶">
        <Row label="Catalogusprijs" value={vehicle.catalogPrice ? formatPrice(vehicle.catalogPrice) : null} />
        <Row label="Bruto BPM" value={vehicle.brutoBpm ? formatPrice(vehicle.brutoBpm) : null} />
      </Section>

      <Section title="APK en Verzekering" emoji="📋">
        <Row label="APK vervaldatum" value={vehicle.apkExpiryDateNL} />
        <Row label="APK status" value={apkTekst} />
        <Row label="WAM verzekerd" value={vehicle.insuranceStatus === "insured" ? "Ja" : vehicle.insuranceStatus === "not_insured" ? "Nee" : "Onbekend"} />
      </Section>

      <APKHistory history={vehicle.apkHistory} apkExpiryDateNL={vehicle.apkExpiryDateNL} />

      <AIAdvice vehicle={vehicle} />

      <p style={{textAlign:'center',fontSize:'11px',color:'#9ca3af',padding:'4px 0 8px'}}>
        Gegevens afkomstig van RDW Open Data
      </p>
    </div>
  );
}