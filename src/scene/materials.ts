import { Color, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

export const PAPER = new Color("#f3f4f6");
export const WARM = new Color("#cbb8a4");

type Recorded = {
  mat: MeshPhysicalMaterial | MeshStandardMaterial;
  base: Color;
  metalness: number;
  roughness: number;
  env: number;
};

export const PLANT: Recorded[] = [];

function remember(
  mat: MeshPhysicalMaterial | MeshStandardMaterial,
  metalness: number,
  roughness: number,
  env: number,
) {
  PLANT.push({ mat, base: mat.color.clone(), metalness, roughness, env });
  return mat;
}

function physical(color: string, metalness: number, roughness: number, extras: Record<string, unknown> = {}) {
  const env = typeof extras.envMapIntensity === "number" ? extras.envMapIntensity : 0.72;
  const mat = new MeshPhysicalMaterial({
    color,
    metalness,
    roughness,
    envMapIntensity: env,
    ...extras,
  });
  return remember(mat, metalness, roughness, env);
}

export const matPaint = physical("#c9d1d8", 0.24, 0.48, {
  clearcoat: 0.18,
  clearcoatRoughness: 0.55,
});

export const matPaintCool = physical("#c5ced6", 0.28, 0.4, {
  clearcoat: 0.12,
  clearcoatRoughness: 0.5,
});

export const matStainless = physical("#b4bdc6", 0.92, 0.28, { envMapIntensity: 0.7 });
export const matSteel = physical("#7a838c", 0.78, 0.4, { envMapIntensity: 0.5 });
export const matGalv = physical("#a8b1b9", 0.7, 0.46);
export const matDark = physical("#555e66", 0.5, 0.46, { envMapIntensity: 0.35 });
export const matConcrete = physical("#d5d9de", 0.02, 0.94, { envMapIntensity: 0.12 });
export const matPad = physical("#d8dee4", 0.04, 0.94, { envMapIntensity: 0.08 });

export const matReactor = matPaint.clone();
matReactor.color.set("#c9d1d8");

export const matGlass = new MeshPhysicalMaterial({
  color: "#d5dde4",
  metalness: 0.05,
  roughness: 0.08,
  transparent: true,
  opacity: 0.45,
  envMapIntensity: 0.8,
});

export const matInk = new MeshStandardMaterial({
  color: "#243038",
  roughness: 0.7,
  metalness: 0.05,
  transparent: true,
  opacity: 0.9,
  depthWrite: false,
});

export const matLink = new MeshStandardMaterial({
  color: "#7d868e",
  metalness: 0.65,
  roughness: 0.32,
  transparent: true,
  opacity: 1,
});

export const matGround = new MeshStandardMaterial({
  color: "#f3f4f6",
  roughness: 1,
  metalness: 0,
});
