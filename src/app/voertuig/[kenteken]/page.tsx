import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidPlate, normalizePlate, formatPlateDisplay } from "@/lib/validation/plate";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehicleDataGrid } from "@/components/vehicle/VehicleDataGrid";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";
import type { VehicleData, ErrorCode } from "@/types/vehicle";

interface PageProps {
  params: Promise<{ kenteken: string }>;
}

interface VehicleSuccess { success: true; data: VehicleData; }
interface VehicleError { success: false; error: ErrorCode; message: string; }
type VehicleResult = VehicleSuccess | VehicleError;

async function getData(plate: string): Promise<VehicleResult> {
  const base = process.env.VERCEL_URL
    ? "https://kentekencheck.vercel.app"
    : "http://localhost:3000";
  const res = await fetch(`${base}/api/vehicle/${plate}`, { cache: "no-store" });
  return res.json() as Promise<VehicleResult>;
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

  const result = await getData(normalized);
  const vehicle = result.success ? result.data : null;
  const errorMessage = !result.success ? result.message : null;

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