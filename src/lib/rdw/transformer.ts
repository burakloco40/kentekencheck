import type { RDWVehicleRaw, RDWApkRaw, RDWFuelRaw, RDWKeuringRaw, RDWGebrekRaw, RDWTerugroepRaw } from "@/types/rdw";
import type { VehicleData, APKStatus, InsuranceStatus, NapStatus, APKKeuring, Terugroepactie } from "@/types/vehicle";
import { formatDateNL, formatDateISO, daysFromToday, formatVehicleType, formatColor, formatBodyStyle, kwToHp } from "@/lib/utils/formatters";
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

function determineFuelType(fuelRecords: RDWFuelRaw[]): string {
  if (fuelRecords.length === 0) return "Onbekend";
  const types = fuelRecords.map(r => r.brandstof_omschrijving?.toLowerCase() ?? "");
  const hybridClass = fuelRecords.find(r => r.klasse_hybride_elektrisch_voertuig)?.klasse_hybride_elektrisch_voertuig?.toUpperCase() ?? "";
  const hasBenzine = types.some(t => t.includes("benzine"));
  const hasDiesel = types.some(t => t.includes("diesel"));
  const hasElektrisch = types.some(t => t.includes("elektriciteit") || t.includes("elektrisch"));
  const hasWaterstof = types.some(t => t.includes("waterstof"));
  if (hasWaterstof) return "Waterstof";
  if (hasElektrisch && (hasBenzine || hasDiesel)) {
    if (hybridClass.includes("OVC-HEV") || hybridClass.includes("OVC-FCHEV")) {
      return hasDiesel ? "Diesel / Plug-in Hybride (PHEV)" : "Benzine / Plug-in Hybride (PHEV)";
    }
    if (hybridClass.includes("NOVC-HEV")) {
      return hasDiesel ? "Diesel / Mild Hybride (MHEV)" : "Benzine / Mild Hybride (MHEV)";
    }
    return hasDiesel ? "Diesel / Elektrisch (Hybride)" : "Benzine / Elektrisch (Hybride)";
  }
  if (hasElektrisch) return "Volledig Elektrisch";
  if (hasDiesel) return "Diesel";
  if (hasBenzine) return "Benzine";
  return fuelRecords[0].brandstof_omschrijving ?? "Onbekend";
}

function determineParticulateFilter(fuelRecords: RDWFuelRaw[]): boolean | null {
  const dieselRecord = fuelRecords.find(r => r.brandstof_omschrijving?.toLowerCase().includes("diesel"));
  if (!dieselRecord) return null;
  const emissionLevel = dieselRecord.uitlaatemissieniveau?.toUpperCase() ?? "";
  const deeltjes = dieselRecord.uitstoot_deeltjes_licht ? parseFloat(dieselRecord.uitstoot_deeltjes_licht) : null;
  if (emissionLevel.includes("EURO 5") || emissionLevel.includes("EURO 6")) return true;
  if (deeltjes !== null && deeltjes <= 0.005) return true;
  if (emissionLevel.includes("EURO 4") || emissionLevel.includes("EURO 3") || emissionLevel.includes("EURO 2") || emissionLevel.includes("EURO 1")) return false;
  return null;
}

function determineMilieuzoneAccess(emissionLevel: string | null, fuelType: string): string | null {
  if (!emissionLevel) return null;
  const level = emissionLevel.toUpperCase();
  const isDiesel = fuelType.toLowerCase().includes("diesel");
  const isBenzine = fuelType.toLowerCase().includes("benzine");
  const isElektrisch = fuelType.toLowerCase().includes("elektrisch") || fuelType.toLowerCase().includes("volledig elektrisch");
  if (isElektrisch) return "Toegang overal (emissieloos)";
  if (level.includes("EURO 6")) return isDiesel ? "Toegang overal (Euro 6 diesel)" : "Toegang overal";
  if (level.includes("EURO 5")) return isDiesel ? "Toegang in de meeste zones (Euro 5 diesel)" : "Toegang overal";
  if (level.includes("EURO 4")) return isDiesel ? "Mogelijk geen toegang in strenge milieuzones (Euro 4 diesel)" : "Toegang in de meeste zones";
  if (level.includes("EURO 3") || level.includes("EURO 2") || level.includes("EURO 1")) {
    return isDiesel || isBenzine ? "Geen toegang in milieuzones (Euro 3 of lager)" : null;
  }
  return null;
}

export function transformRDWData(
  plate: string,
  vehicleBase: RDWVehicleRaw,
  apkData: RDWApkRaw | null,
  fuelData: RDWFuelRaw[],
  keuringen: RDWKeuringRaw[] = [],
  gebreken: RDWGebrekRaw[] = [],
  gebrekOmschrijvingen: Map<string, string> = new Map(),
  terugroepacties: RDWTerugroepRaw[] = []
): VehicleData {
  const primaryFuel = fuelData[0] ?? null;
  const fuelType = determineFuelType(fuelData);
  const rawDisplacement = primaryFuel?.cilinderinhoud ?? vehicleBase.cilinderinhoud ?? null;
  const rawPowerKW = primaryFuel?.nettomaximumvermogen ?? vehicleBase.nettomaximumvermogen ?? null;
  const rawCO2 = primaryFuel?.co2_uitstoot_gecombineerd ?? vehicleBase.co2_uitstoot_gecombineerd ?? null;
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
  const fuelCombined = primaryFuel?.brandstofverbruik_gecombineerd ? parseFloat(primaryFuel.brandstofverbruik_gecombineerd) : null;
  const fuelCity = primaryFuel?.brandstofverbruik_stad ? parseFloat(primaryFuel.brandstofverbruik_stad) : null;
  const fuelHighway = primaryFuel?.brandstofverbruik_buiten_de_bebouwde_kom ? parseFloat(primaryFuel.brandstofverbruik_buiten_de_bebouwde_kom) : null;
  const soundLevel = primaryFuel?.geluidsniveau_rijdend ? parseInt(primaryFuel.geluidsniveau_rijdend, 10) : null;
  const emissionLevel = primaryFuel?.uitlaatemissieniveau ?? null;
  const hasParticulateFilter = determineParticulateFilter(fuelData);
  const milieuzoneAccess = determineMilieuzoneAccess(emissionLevel, fuelType);

  let napStatus: NapStatus = "unknown";
  const tellerstandoordeel = vehicleBase.tellerstandoordeel?.toLowerCase() ?? "";
  if (tellerstandoordeel === "logisch") napStatus = "logisch";
  else if (tellerstandoordeel === "onlogisch") napStatus = "onlogisch";
  else if (tellerstandoordeel.includes("niet geregistreerd") || tellerstandoordeel === "geen oordeel") napStatus = "niet_geregistreerd";

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
    fuelType,
    engineDisplacement: rawDisplacement ? parseInt(rawDisplacement, 10) : null,
    powerKW,
    powerHP: kwToHp(powerKW),
    torque: null,
    co2Emission: rawCO2 ? parseInt(rawCO2, 10) : null,
    fuelConsumptionCombined: fuelCombined,
    fuelConsumptionCity: fuelCity,
    fuelConsumptionHighway: fuelHighway,
    emissionLevel,
    soundLevel,
    hasParticulateFilter,
    milieuzoneAccess,
    massEmpty: vehicleBase.massa_ledig_voertuig ? parseInt(vehicleBase.massa_ledig_voertuig, 10) : null,
    massRijklaar: vehicleBase.massa_rijklaar ? parseInt(vehicleBase.massa_rijklaar, 10) : null,
    massMax: vehicleBase.toegestane_maximum_massa_voertuig ? parseInt(vehicleBase.toegestane_maximum_massa_voertuig, 10) : null,
    towWeightUnbraked: vehicleBase.maximum_massa_trekken_ongeremd ? parseInt(vehicleBase.maximum_massa_trekken_ongeremd, 10) : null,
    towWeightBraked: vehicleBase.maximum_trekken_massa_geremd ? parseInt(vehicleBase.maximum_trekken_massa_geremd, 10) : null,
    catalogPrice,
    brutoBpm: vehicleBase.bruto_bpm ? parseInt(vehicleBase.bruto_bpm, 10) : null,
    wheelbase: vehicleBase.wielbasis ? parseInt(vehicleBase.wielbasis, 10) : null,
    energyLabel: vehicleBase.zuinigheidsclassificatie ?? null,
    engineCode: vehicleBase.type ?? null,
    variant: vehicleBase.variant ?? null,
    typeApproval: vehicleBase.typegoedkeuringsnummer ?? null,
    europeanCategory: vehicleBase.europese_voertuigcategorie ?? null,
    isTaxi: vehicleBase.taxi_indicator === "Ja",
    firstAdmissionDate: formatDateISO(vehicleBase.datum_eerste_toelating),
    firstAdmissionDateNL: formatDateNL(vehicleBase.datum_eerste_toelating),
    firstRegistrationNLDateNL: formatDateNL(vehicleBase.datum_eerste_tenaamstelling_in_nederland),
    lastRegistrationDateNL: formatDateNL(vehicleBase.datum_tenaamstelling),
    isImport,
    napStatus,
    napJaar: vehicleBase.jaar_laatste_registratie_tellerstand ?? null,
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