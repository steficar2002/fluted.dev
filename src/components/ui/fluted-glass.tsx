export { FlutedGlass, flutedGlassPresets } from "@paper-design/shaders-react";
export type { FlutedGlassProps } from "@paper-design/shaders-react";

import { FlutedGlass, flutedGlassPresets } from "@paper-design/shaders-react";

export type FlutedPresetName = "Default" | "Abstract" | "Waves" | "Folds";

/** Look up a Paper Design fluted-glass preset by name. */
export function getFlutedPreset(name: FlutedPresetName) {
  const preset = flutedGlassPresets.find((p) => p.name === name);
  return preset ?? flutedGlassPresets[0];
}

export default FlutedGlass;
