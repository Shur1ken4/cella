"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { copy } from "@/lib/copy";
import { LogoMark } from "@/components/site/logo";
import { SceneStage } from "./stage";
import { TRACKS, type TrackKey } from "./tracks";

declare global {
  interface Window {
    __renderReady?: boolean;
    __sceneCount?: number;
    __setFrame?: (scene: number, progress: number) => Promise<void>;
  }
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

/**
 * Full-screen 1920×1080 frame used by scripts/render-video.mjs to export the
 * explainer as an MP4. The script calls window.__setFrame(scene, progress).
 */
export function RenderFrame() {
  const params = useSearchParams();
  const track = (params.get("track") === "howTo" ? "howTo" : "idea") as TrackKey;
  const scenes = TRACKS[track];
  const [frame, setFrame] = useState({ scene: 0, progress: 1 });

  useEffect(() => {
    window.__sceneCount = scenes.length;
    window.__setFrame = async (scene, progress) => {
      setFrame({ scene, progress });
      // let React commit and Framer Motion's frame loop apply motion values
      await nextFrame();
      await nextFrame();
      await nextFrame();
    };
    document.fonts.ready.then(() => {
      window.__renderReady = true;
    });
  }, [scenes.length]);

  const { Component, title, caption } = scenes[frame.scene];
  // brief fade to black at the end of each scene
  const fade = frame.progress > 0.95 ? Math.max(0, (1 - frame.progress) / 0.05) : 1;

  return (
    <div data-theme="dark" className="fixed inset-0 z-[100] bg-bg-deep text-text" style={{ width: 1920, height: 1080 }}>
      <div className="absolute overflow-hidden rounded-2xl border border-border" style={{ left: 160, top: 24, width: 1600, height: 900, opacity: fade }}>
        <SceneStage>
          <Component progress={frame.progress} />
        </SceneStage>
      </div>
      <div className="absolute flex items-center justify-between gap-10" style={{ left: 160, top: 944, width: 1600, height: 116, opacity: fade }}>
        <div className="max-w-[1300px]">
          <p className="font-heading text-[38px] leading-tight font-bold text-text">{title}</p>
          <p className="mt-1 text-[24px] leading-snug text-text-muted">{caption}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LogoMark className="size-12" />
          <span className="font-heading text-3xl font-bold tracking-tight text-text">{copy.site.name}</span>
        </div>
      </div>
    </div>
  );
}
