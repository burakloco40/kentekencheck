import { NextRequest, NextResponse } from "next/server";
import type { VehicleData } from "@/types/vehicle";

export async function POST(req: NextRequest) {
  const { vehicle }: { vehicle: VehicleData } = await req.json();

  const prompt = `Je bent een Nederlandse auto-expert met diepgaande kennis van autoforums, Reddit, Tweakers en Autoweek.

Analyseer dit specifieke voertuig:
- Merk/Model: ${vehicle.brand} ${vehicle.model}
- Bouwjaar: ${vehicle.firstAdmissionDateNL ?? "onbekend"}
- Motor: ${vehicle.engineDisplacement ? vehicle.engineDisplacement + "cc" : ""} ${vehicle.fuelType} ${vehicle.powerHP ? vehicle.powerHP + "pk" : ""}
- Emissienorm: ${vehicle.emissionLevel ?? "onbekend"}
- Herkomst: ${vehicle.isImport ? "Import" : "Nederlands"}

Geef het volgende terug in dit EXACTE formaat zonder afwijkingen:

KOPPELMOMENT: [Nm waarde]
BANDENMAAT: [standaard bandenmaat bijv. 195/65R15]
AANDRIJVING: [FWD, RWD of AWD]
DISTRIBUTIE: [Riem of Ketting, inclusief vervangingsinterval indien riem]
TURBO: [Ja of Nee]
ONDERHOUDSKOSTEN: [geschatte jaarlijkse onderhoudskosten in euro's]
BESTE_BOUWJAAR: [beste bouwjaar of periode voor dit model]
MARKTWAARDE: [geschatte huidige marktwaarde in euros voor dit bouwjaar]
AFSCHRIJVING: [geschatte afschrijving per jaar in procenten]

BEKENDE PROBLEMEN:
- [probleem 1]
- [probleem 2]
- [probleem 3]

BETROUWBAARHEIDSSCORE: [cijfer 1-10] — [uitleg]

AANKOOPADVIES: [2-3 zinnen]

WAAR OP LETTEN BIJ AANKOOP:
- [punt 1]
- [punt 2]

ONDERHOUDSADVIES: [specifieke punten]

Schrijf in het Nederlands. Wees specifiek.`;

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
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ advice: null, error: data });
    const advice = data.choices?.[0]?.message?.content ?? null;
    return NextResponse.json({ advice });
  } catch (err) {
    return NextResponse.json({ advice: null, error: String(err) });
  }
}