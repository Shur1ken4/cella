import { copy } from "@/lib/copy";
import { PassportCard } from "@/components/bap/passport-card";
import { easeBack, easeInOut, lerp, seg } from "../anim";
import { At, DocTile } from "../kit";
import type { SceneProps } from "../types";
import { CENTER, DOCS } from "./docs";

/** 3 · One digital passport for the drug. Documents fly in and become the card. */
export function ScenePassport({ progress: p }: SceneProps) {
  const card = seg(p, 0.45, 0.7, easeBack);
  const glow = seg(p, 0.6, 0.85);

  return (
    <>
      {DOCS.map((d, i) => {
        const t = seg(p, 0.05 + i * 0.04, 0.4 + i * 0.04, easeInOut);
        const fade = 1 - seg(p, 0.4 + i * 0.03, 0.55 + i * 0.03);
        return (
          <At
            key={d.label}
            x={lerp(d.x, CENTER.x, t)}
            y={lerp(d.y, CENTER.y, t)}
            style={{
              opacity: fade,
              transform: `translate(-50%,-50%) rotate(${d.tilt * (1 - t)}deg) scale(${1 - 0.5 * t})`,
            }}
          >
            <DocTile icon={d.icon} label={d.label} />
          </At>
        );
      })}

      {/* burst of light where the documents merge */}
      <At x={CENTER.x} y={CENTER.y}>
        <span
          className="block rounded-full bg-green-fill blur-2xl"
          style={{ width: 260 * glow, height: 260 * glow, opacity: 0.35 * (1 - seg(p, 0.8, 1)) }}
        />
      </At>

      <At
        x={CENTER.x}
        y={CENTER.y}
        style={{ opacity: Math.min(card, 1), transform: `translate(-50%,-50%) scale(${0.55 + 0.45 * card})`, width: 460 }}
      >
        <PassportCard
          name={copy.asset.name}
          code={copy.asset.code}
          stage={copy.stages[3]}
          owner={copy.institutions.owner.name}
          modality={copy.asset.modality}
          area={copy.asset.area}
          verified={false}
          animate={false}
        />
      </At>
    </>
  );
}
