import { CACHE_REVALIDATE_SECONDS } from "@/lib/utils/constants";
import { vehicleUrl, apkUrl, fuelUrl } from "./endpoints";
import type { RDWVehicleRaw, RDWApkRaw, RDWFuelRaw } from "@/types/rdw";

async function rdwFetch<T>(url: string): Promise<T[]> {
  const res = await fetch(url, { next: { revalidate: CACHE_REVALIDATE_SECONDS }, headers: { Accept: "application/json" } } as RequestInit);
  if (!res.ok) throw new Error(`RDW API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T[]>;
}
export async function fetchVehicleBase(plate: string): Promise<RDWVehicleRaw | null> {
  const results = await rdwFetch<RDWVehicleRaw>(vehicleUrl(plate));
  return results.length > 0 ? results[0] : null;
}
export async function fetchAPKData(plate: string): Promise<RDWApkRaw | null> {
  try { const r = await rdwFetch<RDWApkRaw>(apkUrl(plate)); return r.length > 0 ? r[0] : null; } catch { return null; }
}
export async function fetchFuelData(plate: string): Promise<RDWFuelRaw | null> {
  try { const r = await rdwFetch<RDWFuelRaw>(fuelUrl(plate)); return r.length > 0 ? r[0] : null; } catch { return null; }
}
export async function fetchAllRDWData(plate: string) {
  const [vehicleBase, apkData, fuelData] = await Promise.allSettled([
    fetchVehicleBase(plate), fetchAPKData(plate), fetchFuelData(plate),
  ]);
  return {
    vehicleBase: vehicleBase.status === "fulfilled" ? vehicleBase.value : null,
    apkData: apkData.status === "fulfilled" ? apkData.value : null,
    fuelData: fuelData.status === "fulfilled" ? fuelData.value : null,
    upstreamError: vehicleBase.status === "rejected" ? (vehicleBase.reason as Error) : null,
  };
}
