import { Pill } from "lucide-react";
import { copy } from "@/lib/copy";
import { easeBack, seg, wave } from "../anim";
import { At, DocTile, Node } from "../kit";
import type { SceneProps } from "../types";
import { CENTER, DOCS } from "./docs";

/** 1 · A new drug's history is scattered. */
export function SceneScattered({ progress: p }: SceneProps) {
  const drug = seg(p, 0, 0.15, easeBack);
  return (
    <>
      <svg className="absolute inset-0" width={960} height={540} aria-hidden="true">
        {DOCS.map((d, i) => {
          const a = seg(p, 0.1 + i * 0.07, 0.3 + i * 0.07);
          return (
            <line
              key={d.label}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={d.x}
              y2={d.y}
              strokeDasharray="3 9"
              className="stroke-border-strong"
              strokeWidth={1.5}
              opacity={a * (0.35 + 0.25 * wave(p, 2, i / 6))}
            />
          );
        })}
      </svg>

      <At x={CENTER.x} y={CENTER.y} style={{ opacity: drug, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * drug})` }}>
        <Node icon={Pill} label={copy.explainer.labels.drug} tone="green" size={96} />
      </At>

      {DOCS.map((d, i) => {
        const a = seg(p, 0.1 + i * 0.07, 0.3 + i * 0.07, easeBack);
        const float = 8 * wave(p, 1.2, i / 6);
        return (
          <At
            key={d.label}
            x={d.x}
            y={d.y + float}
            style={{
              opacity: Math.min(a, 1),
              transform: `translate(-50%,-50%) rotate(${d.tilt + 2 * wave(p, 0.8, i / 3)}deg) scale(${0.6 + 0.4 * a})`,
            }}
          >
            <DocTile icon={d.icon} label={d.label} />
          </At>
        );
      })}
    </>
  );
}
