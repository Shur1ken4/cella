import { FileCheck2, Landmark, Users } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatTile } from "@/components/ui/stat-tile";
import { DemoLabel } from "./section";

export function CardsDemo() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <DemoLabel>Card variants</DemoLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["default", "raised", "verified", "interactive"] as const).map((v) => (
            <Card key={v} variant={v} tabIndex={v === "interactive" ? 0 : undefined} className="focus-ring">
              <CardHeader>
                <CardTitle className="font-heading text-base">{v}</CardTitle>
              </CardHeader>
              <CardDescription>
                {v === "verified" ? "Green border + glow for confirmed items." : "Surface with hairline border and inner gradient."}
              </CardDescription>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <DemoLabel>StatTile — cyan (data) · green (confirmed) · loading</DemoLabel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Raised" value="250,000" unit="tUSDC" icon={Landmark} hint="50% of target" />
          <StatTile label="Signed events" value="2" icon={FileCheck2} accent="green" hint="of 5 schemas" />
          <StatTile label="Rights holders" value="3" icon={Users} accent="none" />
          <StatTile label="Raised" value="0" loading icon={Landmark} />
        </div>
      </div>
    </div>
  );
}
