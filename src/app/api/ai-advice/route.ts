import { NextRequest, NextResponse } from "next/server";
import type { VehicleData } from "@/types/vehicle";

export async function POST(req: NextRequest) {
  const { vehicle }: { vehicle: VehicleData } = await req.json();

  const prompt = `Je bent een Nederlandse auto-expert met toegang tot fabrieksspecificaties, werkplaatshandboeken en technische documentatie.

Analyseer dit specifieke voertuig HEEL NAUWKEURIG:
- Merk/Model: ${vehicle.brand} ${vehicle.model}
- Bouwjaar: ${vehicle.firstAdmissionDateNL ?? "onbekend"}
- Motor: ${vehicle.engineDisplacement ? vehicle.engineDisplacement + "cc" : ""} ${vehicle.fuelType} ${vehicle.powerHP ? vehicle.powerHP + "pk" : ""}
- Motorcode: ${vehicle.engineCode ?? "onbekend"}
- Carrosserie: ${vehicle.bodyStyle ?? "onbekend"}
- Emissienorm: ${vehicle.emissionLevel ?? "onbekend"}
- Herkomst: ${vehicle.isImport ? "Import" : "Nederlands"}

BELANGRIJK: Geef EXACTE fabrieksspecificaties voor dit specifieke model en motorvariant. Gebruik het motorvermogen en de motorcode om de juiste specificaties te bepalen. Voor oliecapaciteit: geef de totale vulling inclusief filter zoals vermeld in het werkplaatshandboek.

Geef het volgende terug in dit EXACTE formaat:

KOPPELMOMENT: [exacte Nm waarde bij specifiek toerental bijv. 250 Nm @ 1750 rpm]
BANDENMAAT_VOOR: [standaard voorbandenmaat bijv. 205/55R16]
BANDENMAAT_ACHTER: [standaard achterbandenmaat of ZELFDE]
AANDRIJVING: [FWD, RWD of AWD]
TURBO: [Ja of Nee]
BAGAGERUIMTE: [bagageruimte in liters volgens fabrieksopgave]
TOPSNELHEID: [topsnelheid in km/h volgens fabrieksopgave]
NULHONDERD: [0-100 km/h tijd in seconden volgens fabrieksopgave]
OLIETYPE: [exacte oliespeficicatie bijv. 5W-30 ACEA C3]
OLIECAPACITEIT: [exacte oliecapaciteit inclusief filter in liters volgens werkplaatshandboek, bijv. 5,7 liter]
OLIEVERVERSING: [officieel vervangingsinterval bijv. 15.000 km of 1 jaar]
ONDERHOUDSKOSTEN: [geschatte jaarlijkse onderhoudskosten in euros]
FACELIFT: [jaar van facelift of "Geen"]
AFSCHRIJVING: [afschrijving per jaar in procenten]

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

Schrijf in het Nederlands. Wees zo nauwkeurig mogelijk. Raadpleeg je kennis van officiële werkplaatshandboeken.`;

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
        max_tokens: 1200,
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