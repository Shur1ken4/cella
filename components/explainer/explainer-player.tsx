"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { SceneStage } from "./stage";
import { SCENE_MS, TRACKS, type TrackKey } from "./tracks";

type ExplainerPlayerProps = {
  initialTrack?: TrackKey;
  /** Start playing the first time the player scrolls into view. */
  autoPlay?: boolean;
  className?: string;
};

/**
 * Animated explainer "video" built from progress-driven React scenes.
 * Two tracks: The idea (7 scenes) and How to use it (5 tutorial scenes).
 */
export function ExplainerPlayer({ initialTrack = "idea", autoPlay = true, className }: ExplainerPlayerProps) {
  const reduce = useReducedMotion() ?? false;
  const [track, setTrack] = useState<TrackKey>(initialTrack);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLButtonElement>(null);
  const visible = useRef(true);
  const autoPlayed = useRef(false);

  const scenes = TRACKS[track];
  const scene = scenes[index];
  const Scene = scene.Component;
  // Paused at the very start of a scene: show its final frame as a poster.
  const shownProgress = reduce || (!playing && progress === 0) ? 1 : progress;

  // The playhead lives in refs (read by the animation loop) and is mirrored to state for rendering.
  const pos = useRef({ index: 0, progress: 0 });
  const setPos = useCallback((i: number, p: number) => {
    pos.current = { index: i, progress: p };
    setIndex(i);
    setProgress(p);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setPos(i, 0);
      setEnded(false);
    },
    [setPos]
  );

  const switchTrack = (t: TrackKey) => {
    setTrack(t);
    goTo(0);
    if (!reduce) setPlaying(true);
  };

  // playback loop
  useEffect(() => {
    if (!playing || reduce) return;
    const total = TRACKS[track].length;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (visible.current && !document.hidden) {
        const { index: i, progress: p } = pos.current;
        const next = p + dt / SCENE_MS;
        if (next < 1) setPos(i, next);
        else if (i < total - 1) setPos(i + 1, 0);
        else {
          setPos(i, 1);
          setPlaying(false);
          setEnded(true);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduce, track, setPos]);

  // pause while off-screen; autoplay the first time it scrolls into view
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting && autoPlay && !autoPlayed.current && !reduce) {
          autoPlayed.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlay, reduce]);

  const togglePlay = () => {
    if (ended) {
      goTo(0);
      setPlaying(true);
      return;
    }
    setPlaying((p) => !p);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setEnded(false);
    setPos(i, Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 0.999));
  };

  return (
    <div ref={rootRef} className={cn("flex flex-col gap-4", className)} aria-label={copy.explainer.label} role="region">
      {/* track tabs */}
      <div role="tablist" aria-label={copy.explainer.label} className="inline-flex w-fit gap-1 rounded-md border border-border bg-surface-1 p-1 shadow-card">
        {(Object.keys(TRACKS) as TrackKey[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={track === t}
            onClick={() => switchTrack(t)}
            className={cn(
              "h-9 rounded-sm px-4 text-sm font-medium transition-colors duration-150 ease-brand focus-ring",
              track === t ? "border border-green-deep bg-green-tint text-green" : "border border-transparent text-text-muted hover:text-text"
            )}
          >
            {copy.explainer.tracks[t]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border-strong shadow-pop">
        <button
          ref={stageRef}
          type="button"
          onClick={togglePlay}
          className="relative block w-full cursor-pointer focus-ring"
          aria-label={playing ? copy.explainer.pause : copy.explainer.play}
        >
          <SceneStage>
            <Scene progress={shownProgress} />
          </SceneStage>
          {!playing && !reduce && (
            <span data-theme="dark" className="absolute inset-0 grid place-items-center bg-bg-deep/25" aria-hidden="true">
              <span className="grid size-16 place-items-center rounded-full bg-green-fill text-on-green shadow-glow transition-transform duration-150 ease-brand hover:scale-110 sm:size-20">
                {ended ? <RotateCcw className="size-7" /> : <Play className="size-8 translate-x-0.5 fill-current" />}
              </span>
            </span>
          )}
        </button>

        {/* controls */}
        <div data-theme="dark" className="flex flex-col gap-3 bg-surface-1 px-4 py-3 text-text">
          <div className="flex gap-1.5" aria-hidden="true">
            {scenes.map((s, i) => (
              <div key={s.title} className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-surface-3" onClick={(e) => seek(e, i)}>
                <div
                  className="h-full rounded-full bg-green-fill"
                  style={{ width: `${i < index ? 100 : i === index ? shownProgress * 100 : 0}%` }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="icon-sm" onClick={() => goTo(Math.max(index - 1, 0))} disabled={index === 0} aria-label={copy.explainer.prev}>
              <ChevronLeft aria-hidden="true" />
            </Button>
            {!reduce && (
              <Button size="icon-sm" onClick={togglePlay} aria-label={ended ? copy.explainer.replay : playing ? copy.explainer.pause : copy.explainer.play}>
                {ended ? <RotateCcw aria-hidden="true" /> : playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => goTo(Math.min(index + 1, scenes.length - 1))}
              disabled={index === scenes.length - 1}
              aria-label={copy.explainer.next}
            >
              <ChevronRight aria-hidden="true" />
            </Button>

            <div className="ml-1 flex items-center gap-1.5" role="group" aria-label={copy.explainer.label}>
              {scenes.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={copy.explainer.goTo(i + 1)}
                  aria-current={i === index ? "step" : undefined}
                  className={cn(
                    "size-2.5 rounded-full transition-all duration-250 ease-brand focus-ring",
                    i === index ? "w-6 bg-green-fill" : i < index ? "bg-green-deep" : "bg-surface-3 hover:bg-border-strong"
                  )}
                />
              ))}
            </div>
            <span className="nums ml-auto text-xs text-text-muted">{copy.explainer.sceneOf(index + 1, scenes.length)}</span>
          </div>
        </div>
      </div>

      {/* captions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between" aria-live="polite">
        <div className="max-w-2xl">
          <p className="font-heading text-xl font-semibold text-text">{scene.title}</p>
          <p className="type-body mt-1 text-text-muted">{scene.caption}</p>
          {reduce && <p className="type-caption mt-2 text-text-faint">{copy.explainer.reducedMotion}</p>}
        </div>
        {scene.href && (
          <Button asChild className="shrink-0">
            <Link href={scene.href}>
              {copy.explainer.tryItNow} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
