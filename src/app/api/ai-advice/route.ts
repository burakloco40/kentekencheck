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

Geef het volgende terug in dit EXACTE formaat:

KOPPELMOMENT: [Nm waarde voor deze specifieke motorvariant]
BANDENMAAT_VOOR: [standaard voorbandenmaat bijv. 205/55R16]
BANDENMAAT_ACHTER: [standaard achterbandenmaat bijv. 225/50R16, of ZELFDE als voor- en achterbanden gelijk zijn]
AANDRIJVING: [FWD, RWD of AWD]
TURBO: [Ja of Nee]
ONDERHOUDSKOSTEN: [geschatte jaarlijkse onderhoudskosten in euros voor Nederlands gebruik]
FACELIFT: [jaar van facelift of generatiewijziging, of "Geen" indien niet van toepassing]
AFSCHRIJVING: [geschatte afschrijving per jaar in procenten]

BEKENDE PROBLEMEN:
- [specifiek probleem 1 met componentnaam]
- [specifiek probleem 2 met componentnaam]
- [specifiek probleem 3 met componentnaam]

BETROUWBAARHEIDSSCORE: [cijfer 1-10] — [korte uitleg]

AANKOOPADVIES: [2-3 zinnen praktisch advies]

WAAR OP LETTEN BIJ AANKOOP:
- [controlepunt 1]
- [controlepunt 2]

ONDERHOUDSADVIES: [specifieke onderhoudspunten voor dit model]

Schrijf in het Nederlands. Wees specifiek en noem echte technische componenten.`;

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