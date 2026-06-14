import { CACHE_REVALIDATE_SECONDS, RDW_BASE_URL, RDW_DATASETS } from "@/lib/utils/constants";
import { vehicleUrl, apkUrl, fuelUrl } from "./endpoints";
import type { RDWVehicleRaw, RDWApkRaw, RDWFuelRaw, RDWKeuringRaw, RDWGebrekRaw, RDWGebrekOmschrijvingRaw } from "@/types/rdw";

async function rdwFetch<T>(url: string): Promise<T[]> {
  const res = await fetch(url, {
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  } as RequestInit);
  if (!res.ok) throw new Error(`RDW API error: ${res.status}`);
  return res.json() as Promise<T[]>;
}

export async function fetchVehicleBase(plate: string): Promise<RDWVehicleRaw | null> {
  const results = await rdwFetch<RDWVehicleRaw>(vehicleUrl(plate));
  return results.length > 0 ? results[0] : null;
}

export async function fetchAPKData(plate: string): Promise<RDWApkRaw | null> {
  try {
    const results = await rdwFetch<RDWApkRaw>(apkUrl(plate));
    return results.length > 0 ? results[0] : null;
  } catch { return null; }
}

export async function fetchFuelData(plate: string): Promise<RDWFuelRaw | null> {
  try {
    const results = await rdwFetch<RDWFuelRaw>(fuelUrl(plate));
    return results.length > 0 ? results[0] : null;
  } catch { return null; }
}

export async function fetchKeuringen(plate: string): Promise<RDWKeuringRaw[]> {
  try {
    const url = `${RDW_BASE_URL}/${RDW_DATASETS.KEURINGEN}.json?kenteken=${plate.toUpperCase()}&$limit=20&$order=meld_datum_door_keuringsinstantie+DESC`;
    return await rdwFetch<RDWKeuringRaw>(url);
  } catch { return []; }
}

export async function fetchGebreken(plate: string): Promise<RDWGebrekRaw[]> {
  try {
    const url = `${RDW_BASE_URL}/${RDW_DATASETS.GEBREKEN}.json?kenteken=${plate.toUpperCase()}&$limit=50`;
    return await rdwFetch<RDWGebrekRaw>(url);
  } catch { return []; }
}

export async function fetchGebrekOmschrijving(gebrekId: string): Promise<string | null> {
  try {
    const url = `${RDW_BASE_URL}/${RDW_DATASETS.GEBREK_OMSCHRIJVING}.json?gebrek_identificatie=${gebrekId}`;
    const results = await rdwFetch<RDWGebrekOmschrijvingRaw>(url);
    return results.length > 0 ? results[0].gebrek_omschrijving ?? null : null;
  } catch { return null; }
}

export async function fetchAllRDWData(plate: string) {
  const [vehicleBase, apkData, fuelData, keuringen, gebreken] = await Promise.allSettled([
    fetchVehicleBase(plate),
    fetchAPKData(plate),
    fetchFuelData(plate),
    fetchKeuringen(plate),
    fetchGebreken(plate),
  ]);
  return {
    vehicleBase: vehicleBase.status === "fulfilled" ? vehicleBase.value : null,
    apkData: apkData.status === "fulfilled" ? apkData.value : null,
    fuelData: fuelData.status === "fulfilled" ? fuelData.value : null,
    keuringen: keuringen.status === "fulfilled" ? keuringen.value : [],
    gebreken: gebreken.status === "fulfilled" ? gebreken.value : [],
    upstreamError: vehicleBase.status === "rejected" ? (vehicleBase.reason as Error) : null,
  };
}