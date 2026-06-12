export const RDW_BASE_URL = "https://opendata.rdw.nl/resource";
export const RDW_DATASETS = {
  VEHICLES: "m9d7-ebf2",
  APK: "8ys7-d773",
  FUEL: "8ys7-d773",
} as const;
export const CACHE_REVALIDATE_SECONDS = 3600;
export const APK_WARNING_DAYS = 30;
export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 30;
export const TEST_PLATE = "SH239S";