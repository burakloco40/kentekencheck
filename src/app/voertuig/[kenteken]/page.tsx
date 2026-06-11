import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidPlate, normalizePlate, formatPlateDisplay } from "@/lib/validation/plate";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehicleDataGrid } from "@/components/vehicle/VehicleDataGrid";
import { LicensePlateInput } from "@/components/search/LicensePlateInput";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { fetchAllRDWData } from "@/lib/rdw/client";
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
    if (rdw.upstreamError) {
      errorMessage = "RDW is tijdelijk niet bereikbaar. Probeer het later opnieuw.";
    } else if (!rdw.vehicleBase) {
      errorMessage = "Kenteken " + normalized + " niet gevonden in het RDW register.";
    } else {
      vehicle = transformRDWData(normalized, rdw.vehicleBase, rdw.apkData, rdw.fuelData);
    }
  } catch {
    errorMessage = "Er is een fout opgetreden. Probeer het later opnieuw.";
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Terug
        </Link>
        <LicensePlateInput initialValue={formatPlateDisplay(normalized)} size="compact" />
      </div>
      {errorMessage && (
        <ErrorMessage title="Fout" message={errorMessage} />
      )}
      {vehicle && (
        <div className="space-y-4">
          <VehicleHeader vehicle={vehicle} />
          <VehicleDataGrid vehicle={vehicle} />
        </div>
      )}
    </div>
  );
}