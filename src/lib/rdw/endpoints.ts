import { RDW_BASE_URL, RDW_DATASETS } from "@/lib/utils/constants";

export function buildRDWUrl(dataset: string, plate: string, limit = "1"): string {
  const params = new URLSearchParams({ kenteken: plate.toUpperCase(), $limit: limit });
  const appToken = process.env.RDW_APP_TOKEN;
  if (appToken) params.set("$$app_token", appToken);
  return `${RDW_BASE_URL}/${dataset}.json?${params.toString()}`;
}

export const vehicleUrl = (plate: string) => buildRDWUrl(RDW_DATASETS.VEHICLES, plate, "1");
export const apkUrl = (plate: string) => buildRDWUrl(RDW_DATASETS.APK, plate, "1");
export const fuelUrl = (plate: string) => buildRDWUrl(RDW_DATASETS.FUEL, plate, "10");