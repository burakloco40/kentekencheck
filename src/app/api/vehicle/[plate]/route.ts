import { NextRequest, NextResponse } from "next/server";
import { isValidPlate, normalizePlate } from "@/lib/validation/plate";
import { fetchAllRDWData } from "@/lib/rdw/client";
import { transformRDWData } from "@/lib/rdw/transformer";
import type { ApiError } from "@/types/vehicle";

const store = new Map<string, { count: number; resetAt: number }>();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ plate: string }> }
) {
  const { plate: raw } = await params;
  const plate = normalizePlate(raw ?? "");

  if (!isValidPlate(plate)) {
    return NextResponse.json({
      success: false,
      error: "INVALID_PLATE",
      message: "Ongeldig kenteken.",
    } as ApiError, { status: 400 });
  }

  let r;
  try {
    r = await fetchAllRDWData(plate);
  } catch {
    return NextResponse.json({
      success: false,
      error: "UPSTREAM_ERROR",
      message: "RDW niet bereikbaar.",
    } as ApiError, { status: 503 });
  }

  if (r.upstreamError) {
    return NextResponse.json({
      success: false,
      error: "UPSTREAM_ERROR",
      message: "RDW storing.",
    } as ApiError, { status: 503 });
  }

  if (!r.vehicleBase) {
    return NextResponse.json({
      success: false,
      error: "NOT_FOUND",
      message: "Kenteken " + raw.toUpperCase() + " niet gevonden.",
    } as ApiError, { status: 404 });
  }

  try {
    const data = transformRDWData(plate, r.vehicleBase, r.apkData, r.fuelData);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch {
    return NextResponse.json({
      success: false,
      error: "INTERNAL_ERROR",
      message: "Interne fout.",
    } as ApiError, { status: 500 });
  }
}