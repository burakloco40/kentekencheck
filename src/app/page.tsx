import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidPlate, normalizePlate, formatPlateDisplay } from "@/lib/validation/plate";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehicleDataGrid } from "@/components/vehicle/VehicleDataGrid";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { fetchAllRDWData, fetchGebrekOmschrijving } from "@/lib/rdw/client";
import { transformRDWData } from "@/lib/rdw/transformer";

interface PageProps {
  params: Promise<{ kenteken: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kenteken } = await params;
  const display = formatPlateDisplay(normalizePlate(kenteken));
  return {
    title: "Kenteken " + display,
    description: "Voertuiggegevens voor " + display,
  };
}

export default async function Page({ params }: PageProps) {
  const { kenteken } = await params;
  const normalized = normalizePlate(kenteken);
  if (!isValidPlate(normalized)) notFound();

  let vehicle = null;
  let errorMessage: string | null = null;

  try {
    const rdw = await fetchAllRDWData(normalized);
    console.log("keuringen:", rdw.keuringen.length, "gebreken:", rdw.gebreken.length);
    if (rdw.upstreamError) {
      errorMessage = "RDW is tijdelijk niet bereikbaar. Probeer het later opnieuw.";
    } else if (!rdw.vehicleBase) {
      errorMessage = "Kenteken " + normalized + " niet gevonden in het RDW register.";
    } else {
      const gebrekIds = [...new Set(rdw.gebreken.map(g => g.gebrek_identificatie).filter(Boolean))] as string[];
      const omschrijvingen = new Map<string, string>();
      await Promise.all(
        gebrekIds.map(async (id) => {
          const omschrijving = await fetchGebrekOmschrijving(id);
          if (omschrijving) omschrijvingen.set(id, omschrijving);
        })
      );
      vehicle = transformRDWData(normalized, rdw.vehicleBase, rdw.apkData, rdw.fuelData, rdw.keuringen, rdw.gebreken, omschrijvingen);
      console.log("apkHistory length:", vehicle.apkHistory.length);
    }
  } catch (err) {
    console.log("ERROR:", err);
    errorMessage = "Er is een fout opgetreden. Probeer het later opnieuw.";
  }

  return (
    <div style={{maxWidth:'1000px',margin:'0 auto',padding:'24px 16px 40px'}}>
      <div style={{marginBottom:'24px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'14px',color:'#6b7280',textDecoration:'none',flexShrink:0}}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Terug
          </Link>
          <LicensePlateInput initialValue={formatPlateDisplay(normalized)} size="compact" />
        </div>
      </div>
      {errorMessage && (
        <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:'12px',padding:'16px',color:'#991b1b',fontSize:'14px'}}>
          {errorMessage}
        </div>
      )}
      {vehicle && (
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          <VehicleHeader vehicle={vehicle} />
          <VehicleDataGrid vehicle={vehicle} />
        </div>
      )}
    </div>
  );
}