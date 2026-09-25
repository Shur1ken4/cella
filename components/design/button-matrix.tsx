import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoLabel } from "./section";

const variants = ["primary", "secondary", "ghost", "danger"] as const;
const states = [
  { name: "Default", props: {} },
  { name: "Hover", props: { "data-preview": "hover" } },
  { name: "Focus", props: { "data-preview": "focus" } },
  { name: "Active", props: { "data-preview": "active" } },
  { name: "Disabled", props: { disabled: true } },
  { name: "Loading", props: { loading: true } },
] as const;

export function ButtonMatrix() {
  return (
    <div className="flex flex-col gap-10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="type-label w-28 text-left text-text-faint">Variant</th>
              {states.map((s) => (
                <th key={s.name} className="type-label text-left text-text-faint">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v}>
                <td className="nums text-sm text-cyan">{v}</td>
                {states.map((s) => (
                  <td key={s.name}>
                    <Button variant={v} {...s.props}>
                      {v === "danger" ? "Revoke" : "Sign"}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <DemoLabel>Sizes</DemoLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">
              Try the demo <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div>
          <DemoLabel>Icon buttons (aria-label required)</DemoLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="icon" aria-label="Add document">
              <Plus aria-hidden="true" />
            </Button>
            <Button size="icon" variant="secondary" aria-label="Add document">
              <Plus aria-hidden="true" />
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label="Add document">
              <Plus aria-hidden="true" />
            </Button>
            <Button variant="link">Explorer link</Button>
          </div>
        </div>
      </div>
      <p className="type-caption text-text-faint">
        Hover / focus / active columns are forced previews. Press Tab on this page to see the real 2px cyan focus ring.
      </p>
    </div>
  );
}
