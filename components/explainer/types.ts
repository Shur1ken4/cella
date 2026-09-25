import type { ComponentType } from "react";

/** Every scene is a pure function of progress (0 → 1). */
export type SceneProps = { progress: number };
export type SceneComponent = ComponentType<SceneProps>;
