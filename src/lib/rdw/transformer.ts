import type { RDWVehicleRaw, RDWApkRaw, RDWFuelRaw, RDWKeuringRaw, RDWGebrekRaw, RDWTerugroepRaw } from "@/types/rdw";
import type { VehicleData, APKStatus, InsuranceStatus, APKKeuring, Terugroepactie } from "@/types/vehicle";
import { formatDateNL, formatDateISO, daysFromToday, formatFuelType, formatVehicleType, formatColor, formatBodyStyle, kwToHp } from "@/lib/utils/formatters";
import { formatPlateDisplay } from "@/lib/validation/plate";

function formatTijd(tijd: string | undefined): string {
  if (!tijd) return "";
  const padded = tijd.padStart(4, "0");
  return padded.slice(0, 2) + ":" + padded.slice(2, 4);
}

function formatDatumNLFromYYYYMMDD(d: string | undefined): string {
  if (!d || d.length !== 8) return "";
  const monthNames = ["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"];
  const month = parseInt(d.slice(4, 6), 10) - 1;
  const day = parseInt(d.slice(6, 8), 10);
  const year = d.slice(0, 4);
  return `${day} ${monthNames[month]} ${year}`;
}

export function transformRDWData(
  plate: string,
  vehicleBase: RDWVehicleRaw,
  apkData: RDWApkRaw | null,
  fuelData: RDWFuelRaw | null,
  keuringen: RDWKeuringRaw[] = [],
  gebreken: RDWGebrekRaw[] = [],
  gebrekOmschrijvingen: Map<string, string> = new Map(),
  terugroepacties: RDWTerugroepRaw[] = []
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

  const datumToelating = vehicleBase.datum_eerste_toelating ?? null;
  const datumNLRegistratie = vehicleBase.datum_eerste_tenaamstelling_in_nederland ?? null;
  const isImport = !!(datumToelating && datumNLRegistratie && datumToelating !== datumNLRegistratie);

  const fuelCombined = fuelData?.brandstofverbruik_gecombineerd
    ? parseFloat(fuelData.brandstofverbruik_gecombineerd)
    : null;
  const fuelCity = fuelData?.brandstofverbruik_stad
    ? parseFloat(fuelData.brandstofverbruik_stad)
    : null;
  const fuelHighway = fuelData?.brandstofverbruik_buiten_de_bebouwde_kom
    ? parseFloat(fuelData.brandstofverbruik_buiten_de_bebouwde_kom)
    : null;
  const soundLevel = fuelData?.geluidsniveau_rijdend
    ? parseInt(fuelData.geluidsniveau_rijdend, 10)
    : null;

  const apkHistory: APKKeuring[] = keuringen.map(k => {
    const datum = k.meld_datum_door_keuringsinstantie ?? "";
    const keuringGebreken = gebreken
      .filter(g => g.meld_datum_door_keuringsinstantie === datum)
      .map(g => {
        const id = g.gebrek_identificatie ?? "";
        return gebrekOmschrijvingen.get(id) ?? id;
      });
    return {
      datum,
      datumNL: formatDatumNLFromYYYYMMDD(datum),
      tijd: formatTijd(k.meld_tijd_door_keuringsinstantie),
      soort: k.soort_melding_ki_omschrijving ?? "Keuring",
      gebreken: keuringGebreken,
    };
  });

  const recallActions: Terugroepactie[] = terugroepacties.map(t => ({
    referentie: t.referentiecode_rdw ?? "Onbekend",
    status: t.status ?? "Onbekend",
  }));

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
    numberOfCylinders: vehicleBase.aantal_cilinders ? parseInt(vehicleBase.aantal_cilinders, 10) : null,
    fuelType: formatFuelType(fuelType),
    engineDisplacement: rawDisplacement ? parseInt(rawDisplacement, 10) : null,
    powerKW,
    powerHP: kwToHp(powerKW),
    torque: null,
    co2Emission: rawCO2 ? parseInt(rawCO2, 10) : null,
    fuelConsumptionCombined: fuelCombined,
    fuelConsumptionCity: fuelCity,
    fuelConsumptionHighway: fuelHighway,
    emissionLevel: fuelData?.uitlaatemissieniveau ?? null,
    soundLevel,
    massEmpty: vehicleBase.massa_ledig_voertuig ? parseInt(vehicleBase.massa_ledig_voertuig, 10) : null,
    massRijklaar: vehicleBase.massa_rijklaar ? parseInt(vehicleBase.massa_rijklaar, 10) : null,
    massMax: vehicleBase.toegestane_maximum_massa_voertuig ? parseInt(vehicleBase.toegestane_maximum_massa_voertuig, 10) : null,
    catalogPrice,
    firstAdmissionDate: formatDateISO(vehicleBase.datum_eerste_toelating),
    firstAdmissionDateNL: formatDateNL(vehicleBase.datum_eerste_toelating),
    firstRegistrationNLDateNL: formatDateNL(vehicleBase.datum_eerste_tenaamstelling_in_nederland),
    lastRegistrationDateNL: formatDateNL(vehicleBase.datum_tenaamstelling),
    isImport,
    apkExpiryDate: apkISO,
    apkExpiryDateNL: formatDateNL(apkRaw),
    apkStatus,
    apkDaysRemaining: apkDays !== null && apkStatus !== "unknown" ? apkDays : null,
    apkHistory,
    insuranceStatus,
    hasRecallAction: recallActions.length > 0,
    recallActions,
    isExported: vehicleBase.export_indicator === "Ja",
    fetchedAt: new Date().toISOString(),
  };
}