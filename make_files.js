const fs = require('fs');

// 1. Update types/vehicle.ts - voeg ontbrekende velden toe
fs.writeFileSync('src/types/vehicle.ts', `export type APKStatus = "valid" | "expired" | "unknown";
export type InsuranceStatus = "insured" | "not_insured" | "unknown";
export type ErrorCode = "INVALID_PLATE" | "NOT_FOUND" | "RATE_LIMITED" | "UPSTREAM_ERROR" | "INTERNAL_ERROR";

export interface VehicleData {
  plate: string;
  plateRaw: string;
  brand: string;
  model: string;
  vehicleType: string;
  bodyStyle: string;
  primaryColor: string;
  secondaryColor: string | null;
  numberOfDoors: number | null;
  numberOfSeats: number | null;
  fuelType: string;
  engineDisplacement: number | null;
  powerKW: number | null;
  powerHP: number | null;
  torque: number | null;
  co2Emission: number | null;
  massEmpty: number | null;
  massMax: number | null;
  catalogPrice: number | null;
  firstAdmissionDate: string | null;
  firstAdmissionDateNL: string | null;
  apkExpiryDate: string | null;
  apkExpiryDateNL: string | null;
  apkStatus: APKStatus;
  apkDaysRemaining: number | null;
  insuranceStatus: InsuranceStatus;
  fetchedAt: string;
}

export interface ApiResponse<T> { success: true; data: T; }
export interface ApiError { success: false; error: ErrorCode; message: string; }
export type VehicleApiResponse = ApiResponse<VehicleData> | ApiError;
`);

// 2. Update types/rdw.ts - voeg ontbrekende RDW velden toe
fs.writeFileSync('src/types/rdw.ts', `export interface RDWVehicleRaw {
  kenteken?: string;
  merk?: string;
  handelsbenaming?: string;
  voertuigsoort?: string;
  inrichting?: string;
  eerste_kleur?: string;
  tweede_kleur?: string;
  aantal_deuren?: string;
  aantal_zitplaatsen?: string;
  brandstof_omschrijving?: string;
  cilinderinhoud?: string;
  nettomaximumvermogen?: string;
  massa_ledig_voertuig?: string;
  massa_rijklaar?: string;
  toegestane_maximum_massa_voertuig?: string;
  catalogusprijs?: string;
  datum_eerste_toelating?: string;
  vervaldatum_apk?: string;
  co2_uitstoot_gecombineerd?: string;
  wam_verzekerd?: string;
  aantal_cilinders?: string;
  vermogen_massarijklaar?: string;
}
export interface RDWApkRaw { kenteken?: string; vervaldatum_apk?: string; vervaldatum_apk_dt?: string; }
export interface RDWFuelRaw {
  kenteken?: string;
  brandstof_omschrijving?: string;
  cilinderinhoud?: string;
  nettomaximumvermogen?: string;
  co2_uitstoot_gecombineerd?: string;
  maximum_vermogen_continu?: string;
  toerental_geluidsniveau?: string;
}
`);

// 3. Update transformer - APK uit hoofddataset, alle velden
fs.writeFileSync('src/lib/rdw/transformer.ts', `import type { RDWVehicleRaw, RDWApkRaw, RDWFuelRaw } from "@/types/rdw";
import type { VehicleData, APKStatus, InsuranceStatus } from "@/types/vehicle";
import { formatDateNL, formatDateISO, daysFromToday, formatFuelType, formatVehicleType, formatColor, formatBodyStyle, kwToHp } from "@/lib/utils/formatters";
import { formatPlateDisplay } from "@/lib/validation/plate";
import { APK_WARNING_DAYS } from "@/lib/utils/constants";

export function transformRDWData(
  plate: string,
  vehicleBase: RDWVehicleRaw,
  apkData: RDWApkRaw | null,
  fuelData: RDWFuelRaw | null
): VehicleData {
  const fuelType = vehicleBase.brandstof_omschrijving ?? fuelData?.brandstof_omschrijving ?? null;
  const rawDisplacement = vehicleBase.cilinderinhoud ?? fuelData?.cilinderinhoud ?? null;
  const rawPowerKW = vehicleBase.nettomaximumvermogen ?? fuelData?.nettomaximumvermogen ?? null;
  const rawCO2 = vehicleBase.co2_uitstoot_gecombineerd ?? fuelData?.co2_uitstoot_gecombineerd ?? null;
  const powerKW = rawPowerKW ? Math.round(parseFloat(rawPowerKW)) : null;

  // APK zit ook direct in de hoofddataset
  const apkRaw = vehicleBase.vervaldatum_apk ?? apkData?.vervaldatum_apk ?? null;
  const apkISO = formatDateISO(apkRaw);
  const apkDays = daysFromToday(apkISO);
  let apkStatus: APKStatus = "unknown";
  if (apkISO) { apkStatus = (apkDays !== null && apkDays < 0) ? "expired" : "valid"; }

  let insuranceStatus: InsuranceStatus = "unknown";
  if (vehicleBase.wam_verzekerd !== undefined) {
    insuranceStatus = vehicleBase.wam_verzekerd === "Ja" ? "insured" : "not_insured";
  }

  const rawPrice = vehicleBase.catalogusprijs;
  const catalogPrice = rawPrice && rawPrice !== "0" ? parseInt(rawPrice, 10) : null;

  // massa_ledig_voertuig = leeg gewicht, massa_rijklaar = rijklaar gewicht
  const massLedig = vehicleBase.massa_ledig_voertuig ?? null;
  const massRijklaar = vehicleBase.massa_rijklaar ?? null;

  return {
    plate: formatPlateDisplay(plate),
    plateRaw: plate.toUpperCase(),
    brand: vehicleBase.merk?.toUpperCase() ?? "Onbekend",
    model: vehicleBase.handelsbenaming?.toUpperCase() ?? "Onbekend",
    vehicleType: formatVehicleType(vehicleBase.voertuigsoort),
    bodyStyle: formatBodyStyle(vehicleBase.inrichting),
    primaryColor: formatColor(vehicleBase.eerste_kleur),
    secondaryColor: vehicleBase.tweede_kleur ? formatColor(vehicleBase.tweede_kleur) : null,
    numberOfDoors: vehicleBase.aantal_deuren ? parseInt(vehicleBase.aantal_deuren, 10) : null,
    numberOfSeats: vehicleBase.aantal_zitplaatsen ? parseInt(vehicleBase.aantal_zitplaatsen, 10) : null,
    fuelType: formatFuelType(fuelType),
    engineDisplacement: rawDisplacement ? parseInt(rawDisplacement, 10) : null,
    powerKW,
    powerHP: kwToHp(powerKW),
    torque: null,
    co2Emission: rawCO2 ? parseInt(rawCO2, 10) : null,
    massEmpty: massLedig ? parseInt(massLedig, 10) : null,
    massMax: vehicleBase.toegestane_maximum_massa_voertuig ? parseInt(vehicleBase.toegestane_maximum_massa_voertuig, 10) : null,
    catalogPrice,
    firstAdmissionDate: formatDateISO(vehicleBase.datum_eerste_toelating),
    firstAdmissionDateNL: formatDateNL(vehicleBase.datum_eerste_toelating),
    apkExpiryDate: apkISO,
    apkExpiryDateNL: formatDateNL(apkRaw),
    apkStatus,
    apkDaysRemaining: apkDays !== null && apkStatus !== "unknown" ? apkDays : null,
    insuranceStatus,
    fetchedAt: new Date().toISOString(),
  };
}
`);

// 4. Volledig nieuwe VehicleDataGrid met duidelijke kleuren
fs.writeFileSync('src/components/vehicle/VehicleDataGrid.tsx', `import type { VehicleData } from "@/types/vehicle";
import { formatPrice } from "@/lib/utils/formatters";

interface Props { vehicle: VehicleData; }

function Field({ label, value, unit, accent }: { label: string; value: string | number | null | undefined; unit?: string; accent?: boolean }) {
  const display = value !== null && value !== undefined && String(value).trim() !== "" ? String(value) : null;
  return (
    <div className="flex flex-col gap-1 p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-[#162d58]/20 transition-colors">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      {display ? (
        <span className={"font-bold " + (accent ? "text-[#0f2040] text-xl" : "text-gray-800 text-base")}>
          {display}{unit && <span className="text-gray-400 font-normal text-sm ml-1">{unit}</span>}
        </span>
      ) : (
        <span className="text-gray-300 text-base">Niet beschikbaar</span>
      )}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
      <h2 className="flex items-center gap-2 text-sm font-bold text-[#0f2040] uppercase tracking-wider">
        <span className="text-lg">{icon}</span>
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {children}
      </div>
    </div>
  );
}

export function VehicleDataGrid({ vehicle }: Props) {
  return (
    <div className="space-y-4">

      <Section title="Algemeen" icon="🚗">
        <Field label="Merk" value={vehicle.brand} accent />
        <Field label="Model" value={vehicle.model} accent />
        <Field label="Voertuigsoort" value={vehicle.vehicleType} />
        <Field label="Carrosserie" value={vehicle.bodyStyle} />
        <Field label="Kleur" value={vehicle.primaryColor} />
        {vehicle.secondaryColor && <Field label="2e Kleur" value={vehicle.secondaryColor} />}
        <Field label="Aantal deuren" value={vehicle.numberOfDoors} />
        <Field label="Zitplaatsen" value={vehicle.numberOfSeats} />
        <Field label="Eerste toelating" value={vehicle.firstAdmissionDateNL} />
      </Section>

      <Section title="Motor & Prestaties" icon="⚡">
        <Field label="Brandstof" value={vehicle.fuelType} accent />
        <Field label="Vermogen" value={vehicle.powerHP} unit="pk" accent />
        <Field label="Vermogen (kW)" value={vehicle.powerKW} unit="kW" />
        <Field label="Cilinderinhoud" value={vehicle.engineDisplacement} unit="cc" />
        <Field label="CO₂ uitstoot" value={vehicle.co2Emission} unit="g/km" />
      </Section>

      <Section title="Gewicht & Afmetingen" icon="⚖️">
        <Field label="Leeg gewicht" value={vehicle.massEmpty} unit="kg" accent />
        <Field label="Max. massa" value={vehicle.massMax} unit="kg" />
        <Field label="Catalogusprijs" value={vehicle.catalogPrice ? formatPrice(vehicle.catalogPrice) : null} accent />
      </Section>

      <Section title="APK & Verzekering" icon="📋">
        <Field label="APK vervaldatum" value={vehicle.apkExpiryDateNL} accent />
        <Field
          label="APK status"
          value={vehicle.apkStatus === "valid" ? (vehicle.apkDaysRemaining !== null && vehicle.apkDaysRemaining <= 30 ? "Bijna verlopen (" + vehicle.apkDaysRemaining + " dagen)" : "Geldig") : vehicle.apkStatus === "expired" ? "VERLOPEN" : "Onbekend"}
        />
        <Field
          label="WAM verzekerd"
          value={vehicle.insuranceStatus === "insured" ? "Ja" : vehicle.insuranceStatus === "not_insured" ? "Nee" : "Onbekend"}
        />
      </Section>

      <p className="text-xs text-gray-400 text-center pb-2">
        Bron: RDW Open Data · {new Date(vehicle.fetchedAt).toLocaleString("nl-NL")}
      </p>
    </div>
  );
}
`);

// 5. Verbeterde VehicleHeader
fs.writeFileSync('src/components/vehicle/VehicleHeader.tsx', `import type { VehicleData } from "@/types/vehicle";

interface Props { vehicle: VehicleData; }

export function VehicleHeader({ vehicle }: Props) {
  const apkColor = vehicle.apkStatus === "valid"
    ? (vehicle.apkDaysRemaining !== null && vehicle.apkDaysRemaining <= 30 ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-green-100 text-green-800 border-green-300")
    : vehicle.apkStatus === "expired"
      ? "bg-red-100 text-red-800 border-red-300"
      : "bg-gray-100 text-gray-600 border-gray-300";

  const apkLabel = vehicle.apkStatus === "valid"
    ? (vehicle.apkDaysRemaining !== null && vehicle.apkDaysRemaining <= 30 ? "⚠ APK bijna verlopen" : "✓ APK geldig")
    : vehicle.apkStatus === "expired" ? "✕ APK verlopen" : "– APK onbekend";

  const insColor = vehicle.insuranceStatus === "insured"
    ? "bg-green-100 text-green-800 border-green-300"
    : vehicle.insuranceStatus === "not_insured"
      ? "bg-red-100 text-red-800 border-red-300"
      : "bg-gray-100 text-gray-600 border-gray-300";

  const insLabel = vehicle.insuranceStatus === "insured" ? "✓ WAM verzekerd"
    : vehicle.insuranceStatus === "not_insured" ? "✕ Niet verzekerd"
    : "– Verzekering onbekend";

  return (
    <div className="bg-[#0f2040] text-white rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

        <div className="space-y-4">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">{vehicle.vehicleType}</p>
            <h1 className="font-bold text-3xl sm:text-4xl leading-tight">
              {vehicle.brand}{" "}
              <span className="text-[#F5C518]">{vehicle.model}</span>
            </h1>
            {vehicle.bodyStyle && vehicle.bodyStyle !== "Onbekend" && (
              <p className="text-white/50 text-sm mt-1">{vehicle.bodyStyle} · {vehicle.firstAdmissionDateNL ?? "Onbekend"}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={"text-xs font-bold px-3 py-1.5 rounded-full border-2 " + apkColor}>{apkLabel}</span>
            <span className={"text-xs font-bold px-3 py-1.5 rounded-full border-2 " + insColor}>{insLabel}</span>
          </div>

          {(vehicle.powerHP || vehicle.fuelType) && (
            <div className="flex flex-wrap gap-4 pt-1">
              {vehicle.powerHP && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Vermogen</p>
                  <p className="text-white font-bold text-lg">{vehicle.powerHP} <span className="text-white/60 font-normal text-sm">pk</span></p>
                </div>
              )}
              {vehicle.fuelType && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Brandstof</p>
                  <p className="text-white font-bold text-lg">{vehicle.fuelType}</p>
                </div>
              )}
              {vehicle.engineDisplacement && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Inhoud</p>
                  <p className="text-white font-bold text-lg">{vehicle.engineDisplacement} <span className="text-white/60 font-normal text-sm">cc</span></p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0">
          <div className="inline-flex items-stretch rounded-[6px] border-2 border-[#D4A017]/30 overflow-hidden shadow-lg">
            <div className="flex flex-col items-center justify-center bg-[#162d58] w-10 gap-1 px-1">
              <div className="flex flex-wrap justify-center w-5 gap-0.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-[3px] h-[3px] rounded-full bg-[#F5C518]" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-white tracking-wider leading-none" style={{fontFamily:'Courier Prime, monospace'}}>NL</span>
            </div>
            <div className="bg-[#F5C518] px-5 py-3 flex items-center">
              <span className="font-bold text-2xl text-[#0f2040] tracking-widest" style={{fontFamily:'Courier Prime, monospace'}}>{vehicle.plate}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
`);

console.log('Alle bestanden aangemaakt!');
