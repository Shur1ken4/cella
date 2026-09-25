"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const STAGE_W = 960;
export const STAGE_H = 540;

/**
 * Fixed 960×540 canvas that scales to its container width, so scenes are laid
 * out in stable pixel coordinates (and render 2× for 1920×1080 video).
 */
export function SceneStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-theme="dark"
      className={cn("relative aspect-video w-full overflow-hidden bg-bg-deep text-left text-text", className)}
    >
      {/* soft stage lighting */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,var(--surface-2)_0%,transparent_70%)]"
      />
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
