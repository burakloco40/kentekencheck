import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidPlate, normalizePlate, formatPlateDisplay } from "@/lib/validation/plate";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehicleDataGrid } from "@/components/vehicle/VehicleDataGrid";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";
import { ShareButtons } from "@/components/vehicle/ShareButtons";
import { VehicleHistoryCard } from "@/components/vehicle/VehicleHistoryCard";
import type { VehicleData, ErrorCode } from "@/types/vehicle";

interface PageProps {
  params: Promise<{ kenteken: string }>;
}

interface VehicleSuccess { success: true; data: VehicleData; }
interface VehicleError { success: false; error: ErrorCode; message: string; }
type VehicleResult = VehicleSuccess | VehicleError;

async function getData(plate: string): Promise<VehicleResult> {
  const base = process.env.VERCEL_URL
    ? "https://kentekenrdwcheck.nl"
    : "http://localhost:3000";
  const res = await fetch(`${base}/api/vehicle/${plate}`, { cache: "no-store" });
  return res.json() as Promise<VehicleResult>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { kenteken } = await params;
  const normalized = normalizePlate(kenteken);
  const display = formatPlateDisplay(normalized);

  try {
    const result = await getData(normalized);
    if (result.success && result.data) {
      const v = result.data;
      const title = `Kenteken ${display} — ${v.brand} ${v.model}`;
      const description = `${v.brand} ${v.model} uit ${v.firstAdmissionDateNL ?? "onbekend"}. ${v.fuelType}${v.powerHP ? ", " + v.powerHP + " pk" : ""}. APK tot ${v.apkExpiryDateNL ?? "onbekend"}. Bekijk alle voertuiggegevens op kentekenrdwcheck.nl`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://kentekenrdwcheck.nl/voertuig/${normalized}`,
          siteName: "Kentekenrdwcheck",
          locale: "nl_NL",
          type: "website",
          images: [
            {
              url: "https://kentekenrdwcheck.nl/og-image.png",
              width: 1200,
              height: 630,
              alt: `Kenteken ${display}`,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
        },
      };
    }
  } catch {
    // fallback
  }

  return {
    title: `Kenteken ${display}`,
    description: `Voertuiggegevens voor kenteken ${display} via het officiële RDW register.`,
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
    <div style={{maxWidth:'1200px',margin:'0 auto',padding:'24px 16px 40px'}}>
      <div style={{marginBottom:'24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
            <Link href="/" style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'14px',color:'#6b7280',textDecoration:'none',flexShrink:0}}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Terug
            </Link>
            <LicensePlateInput initialValue={formatPlateDisplay(normalized)} size="compact" />
          </div>
          {vehicle && (
            <ShareButtons plate={vehicle.plate} brand={vehicle.brand} model={vehicle.model} />
          )}
        </div>
      </div>

      {errorMessage && (
        <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:'12px',padding:'16px',color:'#991b1b',fontSize:'14px'}}>
          {errorMessage}
        </div>
      )}

      {vehicle && (
        <div>
          <div style={{marginBottom:'16px'}}>
            <VehicleHeader vehicle={vehicle} />
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'20px',alignItems:'start'}}>
            <div>
              <VehicleDataGrid vehicle={vehicle} />
            </div>
            <div style={{position:'sticky',top:'80px'}}>
              <VehicleHistoryCard vehicle={vehicle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}