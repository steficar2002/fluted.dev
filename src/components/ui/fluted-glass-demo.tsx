"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FlutedGlass, { flutedGlassPresets } from "@/components/ui/fluted-glass";

const MONO = '"Paper Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const IMAGE_BASE = "https://shaders.paper.design/images/image-filters/";
const IMAGE_FILES = [
  "001.webp",
  "002.webp",
  "003.webp",
  "004.webp",
  "005.webp",
  "006.webp",
  "007.webp",
  "008.webp",
  "009.webp",
  "0010.webp",
  "0011.webp",
  "0012.webp",
  "0013.webp",
  "0014.webp",
  "0015.webp",
  "0016.webp",
  "0017.webp",
  "0018.webp",
];

const GRID_SHAPES = ["lines", "linesIrregular", "wave", "zigzag", "pattern"];
const DISTORTION_SHAPES = ["prism", "lens", "contour", "cascade", "flat"];

type SliderDef = {
  key: string;
  min: number;
  max: number;
  step: number;
  int?: boolean;
};

const SLIDERS_A: SliderDef[] = [
  { key: "shadows", min: 0, max: 1, step: 0.01 },
  { key: "highlights", min: 0, max: 1, step: 0.01 },
  { key: "size", min: 0.01, max: 1, step: 0.01 },
];
const SLIDERS_B: SliderDef[] = [
  { key: "distortion", min: 0, max: 1, step: 0.01 },
  { key: "shift", min: -1, max: 1, step: 0.01 },
  { key: "stretch", min: 0, max: 1, step: 0.01 },
  { key: "blur", min: 0, max: 1, step: 0.01 },
  { key: "edges", min: 0, max: 1, step: 0.01 },
  { key: "margin", min: 0, max: 0.5, step: 0.01 },
  { key: "grainMixer", min: 0, max: 1, step: 0.01 },
  { key: "grainOverlay", min: 0, max: 1, step: 0.01 },
  { key: "scale", min: 0.5, max: 4, step: 0.01 },
];
const ANGLE: SliderDef = { key: "angle", min: 0, max: 180, step: 1, int: true };

const PARAM_KEYS = [
  "colorBack",
  "colorShadow",
  "colorHighlight",
  "shadows",
  "highlights",
  "size",
  "shape",
  "angle",
  "distortionShape",
  "distortion",
  "shift",
  "stretch",
  "blur",
  "edges",
  "margin",
  "grainMixer",
  "grainOverlay",
  "scale",
  "fit",
] as const;

type Params = Record<string, string | number>;

function pickParams(source: Record<string, unknown>): Params {
  const out: Params = {};
  for (const k of PARAM_KEYS) out[k] = source[k] as string | number;
  return out;
}

const DEFAULTS = pickParams(
  flutedGlassPresets[0].params as Record<string, unknown>,
);

function fmt(value: number, def: SliderDef) {
  return def.int ? String(Math.round(value)) : Number(value).toFixed(2);
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 26 }}>
      <div style={{ width: 98, flexShrink: 0, fontSize: 11, color: "#222" }}>
        {label}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function ValueBox({
  children,
  width,
}: {
  children: React.ReactNode;
  width?: number;
}) {
  return (
    <div
      style={{
        width: width ?? 62,
        flexShrink: 0,
        height: 24,
        borderRadius: 3,
        background: "rgba(0,0,0,0.055)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        fontSize: 11,
        color: "#222",
      }}
    >
      {children}
    </div>
  );
}

function Slider({
  def,
  value,
  onChange,
}: {
  def: SliderDef;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - def.min) / (def.max - def.min)) * 100;
  return (
    <>
      <div
        style={{
          position: "relative",
          flex: 1,
          height: 24,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 2,
            borderRadius: 1,
            background: "rgba(0,0,0,0.14)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${Math.min(100, Math.max(0, pct))}%`,
            height: 2,
            borderRadius: 1,
            background: "#999997",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `calc(${Math.min(100, Math.max(0, pct))}% - 2.5px)`,
            width: 5,
            height: 12,
            borderRadius: 1,
            background: "#77756f",
          }}
        />
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={def.key}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            opacity: 0,
            cursor: "ew-resize",
          }}
        />
      </div>
      <ValueBox>{fmt(value, def)}</ValueBox>
    </>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  const commit = () => {
    if (/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(text))
      onChange(text);
    else setText(value);
  };
  return (
    <Row label={label}>
      <label
        style={{
          position: "relative",
          width: 24,
          height: 24,
          flexShrink: 0,
          borderRadius: 3,
          background: value,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)",
          cursor: "pointer",
        }}
      >
        <input
          type="color"
          value={value.length === 9 ? value.slice(0, 7) : value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} color`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
      </label>
      <div
        style={{
          flex: 1,
          height: 24,
          borderRadius: 3,
          background: "rgba(0,0,0,0.055)",
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          aria-label={`${label} hex`}
          style={{
            width: "100%",
            background: "transparent",
            border: 0,
            outline: "none",
            fontSize: 11,
            color: "#222",
            fontFamily: MONO,
          }}
        />
      </div>
    </Row>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Row label={label}>
      <div style={{ position: "relative", flex: 1 }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          style={{
            width: "100%",
            height: 24,
            borderRadius: 3,
            border: 0,
            background: "rgba(0,0,0,0.055)",
            fontSize: 11,
            color: "#222",
            fontFamily: MONO,
            padding: "0 8px",
            appearance: "none",
            cursor: "pointer",
          }}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div
          style={{
            position: "absolute",
            right: 8,
            top: 9,
            pointerEvents: "none",
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "5px solid #222",
          }}
        />
      </div>
    </Row>
  );
}

function PanelButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 24,
        borderRadius: 3,
        border: 0,
        cursor: "pointer",
        background: hover ? "#8a8a88" : "#999997",
        color: "#fefefe",
        fontSize: 11,
        fontFamily: MONO,
        letterSpacing: "0.2px",
      }}
    >
      {children}
    </button>
  );
}

export default function FlutedGlassDemo() {
  const [params, setParams] = useState<Params>({ ...DEFAULTS });
  const [image, setImage] = useState<HTMLImageElement | string>(
    `${IMAGE_BASE}0018.webp`,
  );
  const [imageIdx, setImageIdx] = useState(-1);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageIdx >= 0) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `${IMAGE_BASE}${IMAGE_FILES[imageIdx]}`;
      img.onload = () => setImage(img);
    }
  }, [imageIdx]);

  const cycleImage = useCallback(() => {
    setImageIdx((prev) => (prev + 1) % IMAGE_FILES.length);
  }, []);

  const set = (key: string, value: string | number) =>
    setParams((p) => ({ ...p, [key]: value }));

  const applyPreset = (presetParams: Record<string, unknown>) =>
    setParams(pickParams(presetParams));

  const uploadImage = (file: File | undefined) => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImage(img);
      setImageIdx(-1);
    };
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 32,
        width: "100%",
        minHeight: "100vh",
        padding: 32,
        background: "#f8f8f6",
        fontFamily: MONO,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <div
          onClick={cycleImage}
          style={{ flex: 1, minHeight: 480, cursor: "pointer" }}
        >
          <FlutedGlass
            {...(params as object)}
            image={image}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "10px 0 0",
            fontSize: 11,
            color: "rgba(34,34,34,0.5)",
          }}
        >
          Click to change the sample image
        </div>
      </div>

      <div
        style={{
          width: 300,
          flexShrink: 0,
          alignSelf: "flex-start",
          borderRadius: 12,
          background: "#f4f3eb",
          padding: "12px 12px 14px",
          boxShadow:
            "0px 4px 40px -8px rgba(58,34,17,0.1), 0px 12px 20px -8px rgba(58,34,17,0.2), 0px 0px 0px 1px rgba(58,34,17,0.1)",
        }}
      >
        <div style={{ fontSize: 11, color: "#222", padding: "2px 0 8px" }}>
          Presets
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
        >
          {flutedGlassPresets.map((preset) => (
            <PanelButton
              key={preset.name}
              onClick={() =>
                applyPreset(preset.params as Record<string, unknown>)
              }
            >
              {preset.name}
            </PanelButton>
          ))}
        </div>

        <div
          style={{
            height: 1,
            background: "rgba(0,0,0,0.08)",
            margin: "12px 0",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <PanelButton onClick={() => fileRef.current?.click()}>
            Upload image
          </PanelButton>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files?.[0])}
          style={{ display: "none" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ColorRow
            label="colorBack"
            value={String(params.colorBack)}
            onChange={(v) => set("colorBack", v)}
          />
          <ColorRow
            label="colorShadow"
            value={String(params.colorShadow)}
            onChange={(v) => set("colorShadow", v)}
          />
          <ColorRow
            label="colorHighlight"
            value={String(params.colorHighlight)}
            onChange={(v) => set("colorHighlight", v)}
          />
          {SLIDERS_A.map((def) => (
            <Row key={def.key} label={def.key}>
              <Slider
                def={def}
                value={Number(params[def.key])}
                onChange={(v) => set(def.key, v)}
              />
            </Row>
          ))}
          <SelectRow
            label="shape"
            value={String(params.shape)}
            options={GRID_SHAPES}
            onChange={(v) => set("shape", v)}
          />
          <Row label={ANGLE.key}>
            <Slider
              def={ANGLE}
              value={Number(params.angle)}
              onChange={(v) => set("angle", v)}
            />
          </Row>
          <SelectRow
            label="distortionShape"
            value={String(params.distortionShape)}
            options={DISTORTION_SHAPES}
            onChange={(v) => set("distortionShape", v)}
          />
          {SLIDERS_B.map((def) => (
            <Row key={def.key} label={def.key}>
              <Slider
                def={def}
                value={Number(params[def.key])}
                onChange={(v) => set(def.key, v)}
              />
            </Row>
          ))}
          <SelectRow
            label="fit"
            value={String(params.fit)}
            options={["contain", "cover"]}
            onChange={(v) => set("fit", v)}
          />
        </div>
      </div>
    </div>
  );
}
