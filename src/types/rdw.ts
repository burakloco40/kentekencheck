import { RDW_BASE_URL, RDW_DATASETS } from "@/lib/utils/constants";

export function buildRDWUrl(dataset: string, plate: string): string {
  const params = new URLSearchParams({
    kenteken: plate.toUpperCase(),
    $limit: "5",
  });
  const appToken = process.env.RDW_APP_TOKEN;
  if (appToken) params.set("$$app_token", appToken);
  return `${RDW_BASE_URL}/${dataset}.json?${params.toString()}`;
}

export const vehicleUrl = (plate: string) => buildRDWUrl(RDW_DATASETS.VEHICLES, plate);
export const apkUrl = (plate: string) => buildRDWUrl(RDW_DATASETS.APK, plate);
export const fuelUrl = (plate: string) => buildRDWUrl(RDW_DATASETS.FUEL, plate);