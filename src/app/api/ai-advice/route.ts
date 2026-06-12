import { NextRequest, NextResponse } from "next/server";
import type { VehicleData } from "@/types/vehicle";

export async function POST(req: NextRequest) {
  const { vehicle }: { vehicle: VehicleData } = await req.json();

  const prompt = `Je bent een Nederlandse auto-expert. Geef een beknopt maar informatief advies over dit voertuig:

Merk/Model: ${vehicle.brand} ${vehicle.model}
Bouwjaar: ${vehicle.firstAdmissionDateNL ?? "onbekend"}
Brandstof: ${vehicle.fuelType}
Vermogen: ${vehicle.powerHP ? vehicle.powerHP + " pk" : "onbekend"}
Cilinderinhoud: ${vehicle.engineDisplacement ? vehicle.engineDisplacement + " cc" : "onbekend"}
Leeg gewicht: ${vehicle.massEmpty ? vehicle.massEmpty + " kg" : "onbekend"}
APK: ${vehicle.apkStatus === "valid" ? "Geldig" : vehicle.apkStatus === "expired" ? "Verlopen" : "Onbekend"}

Geef advies over:
1. Betrouwbaarheid van dit model en motor
2. Bekende zwakke punten
3. Of dit een goede aankoop is
4. Onderhoudsadvies

Max 200 woorden. Schrijf in het Nederlands.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ advice: null, error: data });
    }

    const advice = data.choices?.[0]?.message?.content ?? null;
    return NextResponse.json({ advice });
  } catch (err) {
    return NextResponse.json({ advice: null, error: String(err) });
  }
}