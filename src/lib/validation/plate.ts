const PLATE_PATTERNS = [
  /^[A-Z]{2}\d{2}\d{2}$/,
  /^\d{2}\d{2}[A-Z]{2}$/,
  /^\d{2}[A-Z]{2}\d{2}$/,
  /^[A-Z]{2}\d{2}[A-Z]{2}$/,
  /^[A-Z]{2}[A-Z]{2}\d{2}$/,
  /^\d{2}[A-Z]{2}[A-Z]{2}$/,
  /^\d{2}[A-Z]{3}\d{1}$/,
  /^\d{1}[A-Z]{3}\d{2}$/,
  /^[A-Z]{2}\d{3}[A-Z]{1}$/,
  /^[A-Z]{1}\d{3}[A-Z]{2}$/,
  /^[A-Z]{3}\d{2}[A-Z]{1}$/,
  /^[A-Z]{1}\d{2}[A-Z]{3}$/,
];

export function normalizePlate(input: string): string {
  return input.toUpperCase().replace(/[-\s]/g, "");
}

export function isValidPlate(input: string): boolean {
  const normalized = normalizePlate(input);
  if (normalized.length < 4 || normalized.length > 8) return false;
  return PLATE_PATTERNS.some((p) => p.test(normalized));
}

export function formatPlateDisplay(raw: string | undefined | null): string {
  if (!raw) return "";
  const n = normalizePlate(raw);
  for (let i = 0; i < PLATE_PATTERNS.length; i++) {
    if (PLATE_PATTERNS[i].test(n)) return formatBySidecode(n, i + 1);
  }
  return n;
}

function formatBySidecode(plate: string, sc: number): string {
  switch (sc) {
    case 1: case 2: case 3: case 4: case 5: case 6:
      return `${plate.slice(0,2)}-${plate.slice(2,4)}-${plate.slice(4,6)}`;
    case 7: case 9:
      return `${plate.slice(0,2)}-${plate.slice(2,5)}-${plate.slice(5,6)}`;
    case 8:
      return `${plate.slice(0,1)}-${plate.slice(1,4)}-${plate.slice(4,6)}`;
    case 10:
      return `${plate.slice(0,1)}-${plate.slice(1,4)}-${plate.slice(4,6)}`;
    case 11:
      return `${plate.slice(0,3)}-${plate.slice(3,5)}-${plate.slice(5,6)}`;
    case 12:
      return `${plate.slice(0,1)}-${plate.slice(1,3)}-${plate.slice(3,6)}`;
    default: return plate;
  }
}