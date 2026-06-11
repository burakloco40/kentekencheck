export type APKStatus = "valid" | "expired" | "unknown";
export type InsuranceStatus = "insured" | "not_insured" | "unknown";
export type ErrorCode = "INVALID_PLATE" | "NOT_FOUND" | "RATE_LIMITED" | "UPSTREAM_ERROR" | "INTERNAL_ERROR";

export interface VehicleData {
  plate: string;
  plateRaw: string;
  brand: string;
  model: string;
  vehicleType: string;
  bodyStyle: string;
  primaryColor: string;
  secondaryColor: string | null;
  numberOfDoors: number | null;
  numberOfSeats: number | null;
  fuelType: string;
  engineDisplacement: number | null;
  powerKW: number | null;
  powerHP: number | null;
  torque: number | null;
  co2Emission: number | null;
  massEmpty: number | null;
  massRijklaar: number | null;
  massMax: number | null;
  catalogPrice: number | null;
  firstAdmissionDate: string | null;
  firstAdmissionDateNL: string | null;
  apkExpiryDate: string | null;
  apkExpiryDateNL: string | null;
  apkStatus: APKStatus;
  apkDaysRemaining: number | null;
  insuranceStatus: InsuranceStatus;
  fetchedAt: string;
}

export interface ApiResponse<T> { success: true; data: T; }
export interface ApiError { success: false; error: ErrorCode; message: string; }
export type VehicleApiResponse = ApiResponse<VehicleData> | ApiError;