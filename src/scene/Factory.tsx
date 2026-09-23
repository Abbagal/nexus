import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { ramp, type Pt } from "../story/model";
import { sectionById } from "../story/sections";
import { storyState } from "../story/state";
import {
  hallAdmin,
  hallControl,
  hallLab,
  plantCompound,
  hallNorth,
  hallPack,
  hallProduction,
  hallUtility,
  hallWarehouse,
  hallWaste,
  rackEast,
  rackNorth,
  rackWest,
  tankGeo,
  towerGeo,
  transformerGeo,
  type BuildingGeo,
} from "./build";
import { matConcrete, matDark, matGalv, matGlass, matPaint, matPaintCool, matSteel } from "./materials";

const AREAS: { name: string; code: string; at: Pt }[] = [
  { name: "Chemical processing", code: "U-200", at: [-1.55, 12.5, -8.15] },
  { name: "Control room", code: "B-12", at: [-21.5, 5.6, -7] },
  { name: "Manufacturing", code: "B-01", at: [6, 11, -48] },
  { name: "R&D centre", code: "B-02", at: [-30, 9.6, -38] },
  { name: "Quality control lab", code: "B-03", at: [34, 7.8, 28] },
  { name: "Packaging", code: "B-04", at: [-2, 8.8, 42] },
  { name: "Warehouse & dispatch", code: "B-05", at: [-46, 10.2, 34] },
  { name: "Utilities & power", code: "B-06", at: [48, 8.6, -6] },
  { name: "Effluent treatment", code: "B-07", at: [40, 7, -42] },
  { name: "Raw material store", code: "T-01", at: [-44, 6.6, -4] },
  { name: "Cooling towers", code: "C-01", at: [20.3, 11.6, -22] },
  { name: "Administration", code: "B-10", at: [16, 7.6, 31] },
];

const capRects: DOMRect[] = [];
let capFrame = -1;

function captionRects(frame: number) {
  if (frame === capFrame) return capRects;
  capFrame = frame;
  capRects.length = 0;
  document.querySelectorAll<HTMLElement>(".cap").forEach((cap) => {
    const style = getComputedStyle(cap);
    if (style.visibility === "hidden" || Number(style.opacity) <= 0.05) return;
    if (cap.classList.contains("finale")) {
      for (const child of cap.children) capRects.push(child.getBoundingClientRect());
    } else {
      capRects.push(cap.getBoundingClientRect());
    }
  });
  return capRects;
}

function Built({
  geo,
  position,
  rotation = 0,
  cool = false,
}: {
  geo: BuildingGeo;
  position: Pt;
  rotation?: number;
  cool?: boolean;
}) {
  const wall = cool ? matPaintCool : matPaint;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {geo.concrete ? <mesh geometry={geo.concrete} material={matConcrete} receiveShadow /> : null}
      {geo.wall ? <mesh geometry={geo.wall} material={wall} castShadow receiveShadow /> : null}
      {geo.metal ? <mesh geometry={geo.metal} material={matGalv} castShadow /> : null}
      {geo.dark ? <mesh geometry={geo.dark} material={matDark} /> : null}
      {geo.glass ? <mesh geometry={geo.glass} material={matGlass} /> : null}
    </group>
  );
}

function Tanks({ position }: { position: Pt }) {
  return (
    <group position={position}>
      <mesh material={matConcrete} position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[9.6, 0.12, 8.6]} />
      </mesh>
      <mesh material={matConcrete} position={[0, 0.48, 4.15]}>
        <boxGeometry args={[9.6, 0.72, 0.16]} />
      </mesh>
      <mesh material={matConcrete} position={[0, 0.48, -4.15]}>
        <boxGeometry args={[9.6, 0.72, 0.16]} />
      </mesh>
      <mesh material={matConcrete} position={[4.75, 0.48, 0]}>
        <boxGeometry args={[0.16, 0.72, 8.3]} />
      </mesh>
      <mesh material={matConcrete} position={[-4.75, 0.48, 0]}>
        <boxGeometry args={[0.16, 0.72, 8.3]} />
      </mesh>
      <mesh material={matGalv} position={[0, 0.5, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 8.4, 12]} />
      </mesh>
      {[-3.4, 0, 3.4].map((x) => (
        <mesh key={x} material={matConcrete} position={[x, 0.2, 0.1]}>
          <boxGeometry args={[0.3, 0.28, 0.7]} />
        </mesh>
      ))}
      {[
        [-3.2, -2.0],
        [3.2, -2.0],
        [-3.2, 2.2],
        [3.2, 2.2],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} material={matGalv} position={[x, 0.5, (z + 0.1) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, Math.abs(z - 0.1), 10]} />
        </mesh>
      ))}
      <mesh material={matPaintCool} position={[4.05, 0.45, 0.1]} castShadow>
        <boxGeometry args={[0.7, 0.6, 0.9]} />
      </mesh>
      {[[-3.2, 0, -2.4], [3.2, 0, -2.4], [-3.2, 0, 2.6], [3.2, 0, 2.6]].map((at) => (
        <group key={at.join()} position={at as Pt}>
          {tankGeo.paint ? <mesh geometry={tankGeo.paint} material={matPaint} castShadow receiveShadow /> : null}
          {tankGeo.steel ? <mesh geometry={tankGeo.steel} material={matGalv} castShadow /> : null}
          {tankGeo.stainless ? <mesh geometry={tankGeo.stainless} material={matSteel} /> : null}
        </group>
      ))}
    </group>
  );
}

const projected = new Vector3();

function AreaLabel({ name, code, at }: { name: string; code: string; at: Pt }) {
  const ref = useRef<HTMLDivElement>(null);
  const anchor = useRef(new Vector3(at[0], at[1], at[2]));
  useFrame(({ camera, size }) => {
    const el = ref.current;
    if (!el) return;
    const p = storyState.progress;
    const site = 1 - ramp(p, sectionById("SECTION_02_FACTORY_INTERIOR").end - 0.03, sectionById("SECTION_02_FACTORY_INTERIOR").end);
    const finale = ramp(p, sectionById("SECTION_15_FINAL").start, sectionById("SECTION_15_FINAL").start + 0.008);
    let opacity = Math.max(site, finale);
    projected.copy(anchor.current).project(camera);
    const x = (projected.x * 0.5 + 0.5) * size.width;
    const y = (-projected.y * 0.5 + 0.5) * size.height;
    const w = el.offsetWidth || 160;
    const h = el.offsetHeight || 22;
    const padX = 36;
    const padTop = 64;
    let dx = -w / 2;
    if (x + dx < padX) dx = padX - x;
    else if (x + dx + w > size.width - padX) dx = size.width - padX - w - x;
    let dy = -(h + 18);
    if (y + dy < padTop) dy = padTop - y;
    const stem = Math.min(w - 8, Math.max(8, -dx));
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.setProperty("--stem", `${stem}px`);
    if (opacity > 0.01) {
      const box = el.getBoundingClientRect();
      const blocked = captionRects(Math.floor(performance.now() / 16)).some(
        (cap) => box.left < cap.right + 12 && box.right > cap.left - 12 && box.bottom > cap.top - 12 && box.top < cap.bottom + 12,
      );
      if (blocked) opacity = 0;
    }
    el.style.opacity = String(opacity);
  });
  return (
    <Html position={at} zIndexRange={[12, 0]} style={{ pointerEvents: "none" }}>
      <div ref={ref} className="area-tag">
        <span className="area-code">{code}</span>
        {name}
      </div>
    </Html>
  );
}

function Wheel({ position }: { position: Pt }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.x = -clock.elapsedTime * 1.6;
  });
  return (
    <group ref={ref} position={position}>
      <mesh material={matDark} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.16, 12]} />
      </mesh>
    </group>
  );
}

function Tanker() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const u = (clock.elapsedTime * 0.018) % 1;
    ref.current.position.set(28 - u * 52, 0, 20.5);
  });
  const axles = [-1.7, -0.15, 1.4, 1.95];
  return (
    <group ref={ref}>
      <mesh material={matSteel} position={[0.15, 0.42, 0]} castShadow>
        <boxGeometry args={[4.6, 0.16, 1.15]} />
      </mesh>
      <mesh material={matDark} position={[-1.55, 0.95, 0]} castShadow>
        <boxGeometry args={[1.15, 0.95, 1.2]} />
      </mesh>
      <mesh material={matGlass} position={[-1.35, 1.15, 0.62]}>
        <boxGeometry args={[0.55, 0.38, 0.03]} />
      </mesh>
      <mesh material={matPaint} position={[0.85, 1.05, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.48, 0.48, 2.7, 18]} />
      </mesh>
      <mesh material={matGalv} position={[-0.45, 1.05, 0]}>
        <sphereGeometry args={[0.46, 14, 10]} />
      </mesh>
      {axles.flatMap((x) => [
        <Wheel key={`${x}-a`} position={[x, 0.28, 0.62]} />,
        <Wheel key={`${x}-b`} position={[x, 0.28, -0.62]} />,
      ])}
    </group>
  );
}

function Road({ position, size }: { position: Pt; size: [number, number] }) {
  return (
    <group position={position}>
      <mesh material={matConcrete} receiveShadow>
        <boxGeometry args={[size[0], 0.08, size[1]]} />
      </mesh>
      <mesh material={matGalv} position={[0, 0.02, size[1] / 2]}>
        <boxGeometry args={[size[0], 0.06, 0.12]} />
      </mesh>
      <mesh material={matGalv} position={[0, 0.02, -size[1] / 2]}>
        <boxGeometry args={[size[0], 0.06, 0.12]} />
      </mesh>
    </group>
  );
}

export function Factory() {
  return (
    <group>
      <Built geo={hallWarehouse} position={[-46, 0, 34]} />
      <Built geo={hallProduction} position={[6, 0, -48]} cool />
      <Built geo={hallNorth} position={[-30, 0, -38]} />
      <Built geo={hallLab} position={[34, 0, 28]} />
      <Built geo={hallPack} position={[-2, 0, 42]} />
      <Built geo={hallUtility} position={[48, 0, -6]} cool />
      <Built geo={hallWaste} position={[40, 0, -42]} />
      <Built geo={hallControl} position={[-21.5, 0, -7]} rotation={Math.PI / 2} cool />
      <Built geo={hallAdmin} position={[16, 0, 31]} />
      <Built geo={plantCompound} position={[0, 0, 0]} />

      <Tanks position={[-44, 0, -4]} />
      <Tanks position={[36, 0, -34]} />
      <Built geo={towerGeo} position={[18, 0, -24]} cool />
      <Built geo={towerGeo} position={[22.6, 0, -24]} cool />
      <Built geo={towerGeo} position={[20.3, 0, -19]} cool />

      <Built geo={transformerGeo} position={[52, 0, -8]} />
      <Built geo={transformerGeo} position={[52, 0, -11.2]} rotation={Math.PI} />

      <Built geo={rackWest} position={[0, 0, 0]} />
      <Built geo={rackEast} position={[0, 0, 0]} />
      <Built geo={rackNorth} position={[0, 0, 0]} />

      <Road position={[-8, 0.04, 20]} size={[78, 3.6]} />
      <Road position={[18, 0.04, -8]} size={[3.6, 70]} />

      <Tanker />
      {AREAS.map((area) => (
        <AreaLabel key={area.name} name={area.name} code={area.code} at={area.at} />
      ))}
    </group>
  );
}
