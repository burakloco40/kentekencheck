import { Badge } from "@/components/ui/Badge";
import type { VehicleData } from "@/types/vehicle";
import { APK_WARNING_DAYS } from "@/lib/utils/constants";
interface APKStatusProps { vehicle: VehicleData; }
export function APKStatus({ vehicle }: APKStatusProps) {
  const { apkStatus, apkExpiryDateNL, apkDaysRemaining } = vehicle;
  if (apkStatus === "unknown") return <Badge variant="gray"><span aria-hidden="true">–</span> APK onbekend</Badge>;
  if (apkStatus === "expired") return <Badge variant="red"><span aria-hidden="true">✕</span> APK verlopen{apkExpiryDateNL && <span className="font-normal opacity-80"> · {apkExpiryDateNL}</span>}</Badge>;
  const isWarning = apkDaysRemaining !== null && apkDaysRemaining <= APK_WARNING_DAYS;
  return (
    <Badge variant={isWarning ? "orange" : "green"}>
      <span aria-hidden="true">{isWarning ? "⚠" : "✓"}</span> APK geldig
      {apkExpiryDateNL && <span className="font-normal opacity-80"> · tot {apkExpiryDateNL}</span>}
      {isWarning && apkDaysRemaining !== null && <span className="font-normal"> ({apkDaysRemaining} dag{apkDaysRemaining !== 1 ? "en" : ""})</span>}
    </Badge>
  );
}
