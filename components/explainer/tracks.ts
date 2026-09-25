import { copy } from "@/lib/copy";
import type { SceneComponent } from "./types";
import { SceneScattered } from "./idea/scene-1-scattered";
import { SceneNoTrust } from "./idea/scene-2-no-trust";
import { ScenePassport } from "./idea/scene-3-passport";
import { SceneConfirm } from "./idea/scene-4-confirm";
import { SceneFund } from "./idea/scene-5-fund";
import { ScenePaid } from "./idea/scene-6-paid";
import { SceneTagline } from "./idea/scene-7-tagline";
import { TutorialOpen } from "./how-to/tutorial-1-open";
import { TutorialSign } from "./how-to/tutorial-2-sign";
import { TutorialMoney } from "./how-to/tutorial-3-money";
import { TutorialDeposit } from "./how-to/tutorial-4-deposit";
import { TutorialClaim } from "./how-to/tutorial-5-claim";

export const SCENE_MS = 7000;

export type TrackKey = "idea" | "howTo";

export type SceneDef = {
  title: string;
  caption: string;
  href?: string;
  Component: SceneComponent;
};

const ideaComponents = [SceneScattered, SceneNoTrust, ScenePassport, SceneConfirm, SceneFund, ScenePaid, SceneTagline];
const howToComponents = [TutorialOpen, TutorialSign, TutorialMoney, TutorialDeposit, TutorialClaim];

export const TRACKS: Record<TrackKey, SceneDef[]> = {
  idea: copy.explainer.idea.map((s, i) => ({ ...s, Component: ideaComponents[i] })),
  howTo: copy.explainer.howTo.map((s, i) => ({ ...s, Component: howToComponents[i] })),
};
