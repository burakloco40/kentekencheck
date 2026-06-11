import { Badge } from "@/components/ui/Badge";
import type { VehicleData } from "@/types/vehicle";
interface InsuranceStatusProps { vehicle: VehicleData; }
export function InsuranceStatus({ vehicle }: InsuranceStatusProps) {
  const { insuranceStatus } = vehicle;
  if (insuranceStatus === "insured") return <Badge variant="green"><span aria-hidden="true">✓</span> WAM verzekerd</Badge>;
  if (insuranceStatus === "not_insured") return <Badge variant="red"><span aria-hidden="true">✕</span> Niet verzekerd</Badge>;
  return <Badge variant="gray"><span aria-hidden="true">–</span> Verzekering onbekend</Badge>;
}
