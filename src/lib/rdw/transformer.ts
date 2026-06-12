import type { RDWVehicleRaw, RDWApkRaw, RDWFuelRaw } from "@/types/rdw";
import type { VehicleData, APKStatus, InsuranceStatus } from "@/types/vehicle";
import { formatDateNL, formatDateISO, daysFromToday, formatFuelType, formatVehicleType, formatColor, formatBodyStyle, kwToHp } from "@/lib/utils/formatters";
import { formatPlateDisplay } from "@/lib/validation/plate";

export function transformRDWData(
  plate: string,
  vehicleBase: RDWVehicleRaw,
  apkData: RDWApkRaw | null,
  fuelData: RDWFuelRaw | null
): VehicleData {
  const fuelType = fuelData?.brandstof_omschrijving ?? vehicleBase.brandstof_omschrijving ?? null;
  const rawDisplacement = fuelData?.cilinderinhoud ?? vehicleBase.cilinderinhoud ?? null;
  const rawPowerKW = fuelData?.nettomaximumvermogen ?? vehicleBase.nettomaximumvermogen ?? null;
  const rawCO2 = fuelData?.co2_uitstoot_gecombineerd ?? vehicleBase.co2_uitstoot_gecombineerd ?? null;
  const powerKW = rawPowerKW ? Math.round(parseFloat(rawPowerKW)) : null;
  const apkRaw = vehicleBase.vervaldatum_apk ?? apkData?.vervaldatum_apk ?? null;
  const apkISO = formatDateISO(apkRaw);
  const apkDays = daysFromToday(apkISO);
  let apkStatus: APKStatus = "unknown";
  if (apkISO) {
    apkStatus = (apkDays !== null && apkDays < 0) ? "expired" : "valid";
  }
  let insuranceStatus: InsuranceStatus = "unknown";
  if (vehicleBase.wam_verzekerd !== undefined) {
    insuranceStatus = vehicleBase.wam_verzekerd === "Ja" ? "insured" : "not_insured";
  }
  const rawPrice = vehicleBase.catalogusprijs;
  const catalogPrice = rawPrice && rawPrice !== "0" ? parseInt(rawPrice, 10) : null;
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
    massEmpty: vehicleBase.massa_ledig_voertuig ? parseInt(vehicleBase.massa_ledig_voertuig, 10) : null,
    massRijklaar: vehicleBase.massa_rijklaar ? parseInt(vehicleBase.massa_rijklaar, 10) : null,
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