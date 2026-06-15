import { NextRequest, NextResponse } from "next/server";
import type { VehicleData } from "@/types/vehicle";

export async function POST(req: NextRequest) {
  const { vehicle }: { vehicle: VehicleData } = await req.json();

  const prompt = `Je bent een Nederlandse auto-expert met diepgaande kennis van autoforums, Reddit (r/cars, r/mechanicadvice), Tweakers autoforum, Autoweek en andere autosites.

Analyseer dit specifieke voertuig:
- Merk/Model: ${vehicle.brand} ${vehicle.model}
- Bouwjaar: ${vehicle.firstAdmissionDateNL ?? "onbekend"}
- Motor: ${vehicle.engineDisplacement ? vehicle.engineDisplacement + "cc" : ""} ${vehicle.fuelType} ${vehicle.powerHP ? vehicle.powerHP + "pk" : ""}
- Cilinderinhoud: ${vehicle.engineDisplacement ?? "onbekend"}cc
- Emissienorm: ${vehicle.emissionLevel ?? "onbekend"}
- Kilometerstand: onbekend
- Herkomst: ${vehicle.isImport ? "Import" : "Nederlands"}

Geef een gedetailleerde analyse op basis van wat bekend is van forums en eigenaarservaringen:

KOPPELMOMENT: [exacte Nm waarde voor deze specifieke motorvariant]

BEKENDE PROBLEMEN:
- [Specifiek technisch probleem 1 dat bekend is van forums voor dit model/motor, met component naam]
- [Specifiek technisch probleem 2]
- [Specifiek technisch probleem 3]

BETROUWBAARHEIDSSCORE: [cijfer 1-10] — [korte uitleg waarom]

AANKOOPADVIES: [2-3 zinnen praktisch advies specifiek voor dit model en bouwjaar]

WAAR OP LETTEN BIJ AANKOOP:
- [Specifiek controlepunt 1]
- [Specifiek controlepunt 2]

ONDERHOUDSADVIES: [Specifieke onderhoudspunten voor dit model]

Schrijf in het Nederlands. Wees specifiek en noem echte technische componenten. Geen vage algemene uitspraken.`;

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
        max_tokens: 800,
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