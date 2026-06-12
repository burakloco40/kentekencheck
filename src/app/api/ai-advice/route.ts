import { NextRequest, NextResponse } from "next/server";
import type { VehicleData } from "@/types/vehicle";

export async function POST(req: NextRequest) {
  const { vehicle }: { vehicle: VehicleData } = await req.json();

  const prompt = `Je bent een Nederlandse auto-expert met toegang tot technische specificaties. Geef advies over dit voertuig:

Merk/Model: ${vehicle.brand} ${vehicle.model}
Bouwjaar: ${vehicle.firstAdmissionDateNL ?? "onbekend"}
Brandstof: ${vehicle.fuelType}
Vermogen: ${vehicle.powerHP ? vehicle.powerHP + " pk / " + vehicle.powerKW + " kW" : "onbekend"}
Cilinderinhoud: ${vehicle.engineDisplacement ? vehicle.engineDisplacement + " cc" : "onbekend"}
Leeg gewicht: ${vehicle.massEmpty ? vehicle.massEmpty + " kg" : "onbekend"}
APK: ${vehicle.apkStatus === "valid" ? "Geldig" : vehicle.apkStatus === "expired" ? "Verlopen" : "Onbekend"}
Catalogusprijs: ${vehicle.catalogPrice ? "€" + vehicle.catalogPrice : "onbekend"}

Geef het volgende terug in dit exacte formaat:

KOPPELMOMENT: [maximaal koppelmoment in Nm op basis van jouw kennis van dit model, of "onbekend"]

BETROUWBAARHEID: [beoordeling 1-10 met korte uitleg]

AANDACHTSPUNTEN:
- [punt 1]
- [punt 2]
- [punt 3]

AANKOOPADVIES: [2-3 zinnen direct advies]

ONDERHOUD: [2-3 zinnen onderhoudsadvies]

Schrijf in het Nederlands. Wees direct en praktisch.`;

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
        max_tokens: 600,
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