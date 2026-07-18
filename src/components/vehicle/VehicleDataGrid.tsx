"use client";
import type { VehicleData } from "@/types/vehicle";
import { formatPrice } from "@/lib/utils/formatters";
import { AIAdvice } from "./AIAdvice";
import { APKHistory } from "./APKHistory";
import { RecallActions } from "./RecallActions";

interface Props { vehicle: VehicleData; }

function Row({ label, value, unit, index }: {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  index: number;
}) {
  const display = (value !== null && value !== undefined && String(value).trim() !== "") ? String(value) : null;
  if (!display) return null;
  return (
    <div style={{display:'flex',alignItems:'center',padding:'11px 16px',borderBottom:'1px solid #e5e7eb',background: index % 2 === 0 ? 'white' : '#f8fafc'}}>
      <span style={{width:'45%',fontSize:'13px',color:'#6b7280',fontWeight:500,flexShrink:0}}>{label}</span>
      <span style={{fontSize:'13px',color:'#111827',fontWeight:600}}>
        {display}{unit && <span style={{fontSize:'12px',fontWeight:400,color:'#9ca3af',marginLeft:'3px'}}>{unit}</span>}
      </span>
    </div>
  );
}

function Section({ title, emoji, rows }: {
  title: string;
  emoji: string;
  rows: { label: string; value: string | number | null | undefined; unit?: string }[];
}) {
  const visibleRows = rows.filter(r => r.value !== null && r.value !== undefined && String(r.value).trim() !== "");
  if (visibleRows.length === 0) return null;
  return (
    <div style={{borderRadius:'14px',overflow:'hidden',border:'1px solid #e5e7eb',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
      <div style={{background:'#1e3a5f',padding:'12px 16px',display:'flex',alignItems:'center',gap:'8px'}}>
        <span>{emoji}</span>
        <span style={{fontSize:'13px',fontWeight:700,color:'white',textTransform:'uppercase',letterSpacing:'0.06em'}}>{title}</span>
      </div>
      <div>
        {visibleRows.map((row, i) => (
          <Row key={row.label} label={row.label} value={row.value} unit={row.unit} index={i} />
        ))}
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

      <Section title="Voertuig" emoji="🚗" rows={[
        {label:'Merk', value: vehicle.brand},
        {label:'Model', value: vehicle.model},
        {label:'Voertuigsoort', value: vehicle.vehicleType},
        {label:'Carrosserie', value: vehicle.bodyStyle},
        {label:'Kleur', value: vehicle.primaryColor},
        {label:'2e kleur', value: vehicle.secondaryColor},
        {label:'Aantal deuren', value: vehicle.numberOfDoors},
        {label:'Aantal zitplaatsen', value: vehicle.numberOfSeats},
        {label:'EU categorie', value: vehicle.europeanCategory},
        {label:'Eerste toelating', value: vehicle.firstAdmissionDateNL},
        {label:'Eerste NL registratie', value: vehicle.firstRegistrationNLDateNL},
        {label:'Laatste tenaamstelling', value: vehicle.lastRegistrationDateNL},
        {label:'Herkomst', value: vehicle.isImport ? "Import" : "Nederlands gekentekend"},
        {label:'Export', value: vehicle.isExported ? "Ja — geëxporteerd" : null},
        {label:'Taxi', value: vehicle.isTaxi ? "Ja" : null},
      ]} />

      <Section title="Motor en Techniek" emoji="⚙️" rows={[
        {label:'Brandstof', value: vehicle.fuelType},
        {label:'Vermogen', value: vehicle.powerHP, unit: 'pk'},
        {label:'Vermogen', value: vehicle.powerKW, unit: 'kW'},
        {label:'Cilinderinhoud', value: vehicle.engineDisplacement, unit: 'cc'},
        {label:'Aantal cilinders', value: vehicle.numberOfCylinders},
        {label:'Motorcode', value: vehicle.engineCode},
        {label:'Variant', value: vehicle.variant},
        {label:'CO2 uitstoot', value: vehicle.co2Emission, unit: 'g/km'},
        {label:'Emissienorm', value: vehicle.emissionLevel},
        {label:'Energielabel', value: vehicle.energyLabel},
       {label:'Geluidsniveau', value: vehicle.soundLevel, unit: 'dB'},
        {label:'Roetfilter (DPF)', value: vehicle.hasParticulateFilter === null ? null : vehicle.hasParticulateFilter ? "Ja" : "Nee"},
        {label:'Milieuzone toegang', value: vehicle.milieuzoneAccess},
      ]} />

      <Section title="Brandstofverbruik" emoji="⛽" rows={[
        {label:'Gecombineerd', value: vehicle.fuelConsumptionCombined, unit: 'l/100km'},
        {label:'Stad', value: vehicle.fuelConsumptionCity, unit: 'l/100km'},
        {label:'Snelweg', value: vehicle.fuelConsumptionHighway, unit: 'l/100km'},
      ]} />

      <Section title="Gewicht en Afmetingen" emoji="⚖️" rows={[
        {label:'Leeg gewicht', value: vehicle.massEmpty, unit: 'kg'},
        {label:'Rijklaar gewicht', value: vehicle.massRijklaar, unit: 'kg'},
        {label:'Max. toegestane massa', value: vehicle.massMax, unit: 'kg'},
        {label:'Trekgewicht ongeremd', value: vehicle.towWeightUnbraked, unit: 'kg'},
        {label:'Trekgewicht geremd', value: vehicle.towWeightBraked, unit: 'kg'},
        {label:'Wielbasis', value: vehicle.wheelbase, unit: 'cm'},
      ]} />

      <Section title="Financieel" emoji="💶" rows={[
        {label:'Catalogusprijs', value: vehicle.catalogPrice ? formatPrice(vehicle.catalogPrice) : null},
        {label:'Bruto BPM', value: vehicle.brutoBpm ? formatPrice(vehicle.brutoBpm) : null},
      ]} />

      <Section title="APK en Verzekering" emoji="📋" rows={[
        {label:'APK vervaldatum', value: vehicle.apkExpiryDateNL},
        {label:'APK status', value: apkTekst},
        {label:'WAM verzekerd', value: vehicle.insuranceStatus === "insured" ? "Ja" : vehicle.insuranceStatus === "not_insured" ? "Nee" : "Onbekend"},
      ]} />

      <APKHistory history={vehicle.apkHistory} apkExpiryDateNL={vehicle.apkExpiryDateNL} />

      <AIAdvice vehicle={vehicle} />

      <p style={{textAlign:'center',fontSize:'11px',color:'#9ca3af',padding:'4px 0 8px'}}>
        Gegevens afkomstig van RDW Open Data
      </p>
    </div>
  );
}