export function formatDateNL(rdwDate: string | undefined | null): string | null {
  if (!rdwDate || rdwDate.length !== 8) return null;
  const year = rdwDate.slice(0, 4);
  const month = parseInt(rdwDate.slice(4, 6), 10);
  const day = parseInt(rdwDate.slice(6, 8), 10);
  const monthNames = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
  if (month < 1 || month > 12) return null;
  return `${day} ${monthNames[month - 1]} ${year}`;
}
export function formatDateISO(rdwDate: string | undefined | null): string | null {
  if (!rdwDate || rdwDate.length !== 8) return null;
  return `${rdwDate.slice(0, 4)}-${rdwDate.slice(4, 6)}-${rdwDate.slice(6, 8)}`;
}
export function daysFromToday(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
export function formatPrice(amount: number | null): string | null {
  if (amount === null || amount === undefined) return null;
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export function formatFuelType(rdwFuel: string | undefined | null): string {
  if (!rdwFuel) return "Onbekend";
  const map: Record<string, string> = { BENZINE: "Benzine", DIESEL: "Diesel", ELEKTRISCH: "Elektrisch", "LPG G3": "LPG", LPG: "LPG", CNG: "CNG (aardgas)", WATERSTOF: "Waterstof" };
  return map[rdwFuel.toUpperCase()] ?? capitalize(rdwFuel.toLowerCase());
}
export function formatVehicleType(rdwType: string | undefined | null): string {
  if (!rdwType) return "Onbekend";
  const map: Record<string, string> = { PERSONENAUTO: "Personenauto", BEDRIJFSAUTO: "Bedrijfsauto", MOTOR: "Motor", BROMFIETS: "Bromfiets", AANHANGWAGEN: "Aanhangwagen" };
  return map[rdwType.toUpperCase()] ?? capitalize(rdwType.toLowerCase());
}
export function formatColor(rdwColor: string | undefined | null): string {
  if (!rdwColor) return "Onbekend";
  const map: Record<string, string> = { ZWART: "Zwart", WIT: "Wit", GRIJS: "Grijs", ZILVER: "Zilver", BLAUW: "Blauw", ROOD: "Rood", GROEN: "Groen", GEEL: "Geel", ORANJE: "Oranje", BRUIN: "Bruin", BEIGE: "Beige", PAARS: "Paars", DIVERSEN: "Diversen" };
  return map[rdwColor.toUpperCase()] ?? capitalize(rdwColor.toLowerCase());
}
export function formatBodyStyle(rdwBody: string | undefined | null): string {
  if (!rdwBody) return "Onbekend";
  return rdwBody.toLowerCase().split(" ").map(capitalize).join(" ");
}
export function kwToHp(kw: number | null): number | null {
  if (kw === null) return null;
  return Math.round(kw * 1.35962);
}
