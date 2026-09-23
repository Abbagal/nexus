import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { DIM, P, incidentTint, type Pt } from "../story/model";
import { storyState } from "../story/state";
import { matDark, matGalv, matGlass, matPaint, matPaintCool, matStainless, matSteel } from "./materials";

export function Agitator({ slow = false }: { slow?: boolean }) {
  const spin = useRef<Group>(null);
  const y = DIM.reactorSkirt + DIM.reactorShell + DIM.reactorR * 0.4 + 0.21;
  useFrame((_, delta) => {
    if (!spin.current) return;
    const drag = slow ? 1 - incidentTint(storyState.progress) * 0.45 : 1;
    spin.current.rotation.y += delta * 0.85 * drag;
  });
  return (
    <group position={[0, y, 0]}>
      <mesh material={matGalv} position={[0, 0.005, 0]} castShadow>
        <cylinderGeometry args={[0.31, 0.31, 0.05, 20]} />
      </mesh>
      <mesh material={matSteel} position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.28, 18]} />
      </mesh>
      <group ref={spin} position={[0, 0.48, 0]}>
        <mesh material={matDark} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.46, 20]} />
        </mesh>
        <mesh material={matSteel} position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 12]} />
        </mesh>
        <mesh material={matGalv} position={[0, 0.02, 0]}>
          <torusGeometry args={[0.3, 0.012, 6, 18]} />
        </mesh>
      </group>
    </group>
  );
}

export function Pump({ position, phase = 0 }: { position: Pt; phase?: number }) {
  const motor = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (motor.current) motor.current.rotation.x = clock.elapsedTime * 2.4 + phase;
  });
  return (
    <group position={position}>
      <mesh material={matGalv} position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.1, 0.58]} />
      </mesh>
      <mesh material={matSteel} position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.92, 0.07, 0.42]} />
      </mesh>
      <mesh material={matPaint} position={[-0.08, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.2, 18, 14]} />
      </mesh>
      <mesh material={matStainless} position={[0.16, 0.56, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.26, 12]} />
      </mesh>
      <mesh material={matDark} position={[0.28, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
      </mesh>
      <group ref={motor} position={[0.58, 0.4, 0]}>
        <mesh material={matSteel} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.48, 18]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} material={matDark} position={[-0.16 + i * 0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.158, 0.009, 5, 14]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function Valve({ position, rotation = [0, 0, 0] }: { position: Pt; rotation?: Pt }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh material={matStainless} castShadow>
        <sphereGeometry args={[0.085, 14, 12]} />
      </mesh>
      <mesh material={matSteel} position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
      </mesh>
      <mesh material={matDark} position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.065, 0.007, 6, 16]} />
      </mesh>
    </group>
  );
}

export function Sensor({ position, rotation = [0, 0, 0] }: { position: Pt; rotation?: Pt }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh material={matSteel} position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.14, 8]} />
      </mesh>
      <mesh material={matDark} position={[0, 0.17, 0]} castShadow>
        <boxGeometry args={[0.07, 0.05, 0.045]} />
      </mesh>
      <mesh material={matStainless} position={[0, 0.17, 0.028]}>
        <circleGeometry args={[0.014, 12]} />
      </mesh>
    </group>
  );
}

export function Utilities() {
  const louvers = [0, 1, 2];
  return (
    <group>
      <group position={P.shelter}>
        <mesh material={matPaint} castShadow receiveShadow position={[0, 1.3, 0]}>
          <boxGeometry args={[3.6, 2.6, 2.7]} />
        </mesh>
        <mesh material={matGalv} position={[0, 2.64, 0]} castShadow>
          <boxGeometry args={[3.85, 0.08, 2.95]} />
        </mesh>
        <mesh material={matGlass} position={[0, 1.55, 1.36]}>
          <boxGeometry args={[2.25, 0.7, 0.03]} />
        </mesh>
        <mesh material={matDark} position={[-1.22, 0.72, 1.36]}>
          <boxGeometry args={[0.58, 1.35, 0.04]} />
        </mesh>
      </group>
      <group position={P.mcc}>
        {louvers.map((i) => (
          <mesh key={i} material={matPaintCool} castShadow receiveShadow position={[0, 1.15, -1.15 + i * 1.15]}>
            <boxGeometry args={[0.82, 2.3, 1.02]} />
          </mesh>
        ))}
        {louvers.map((i) => (
          <mesh key={`vent-${i}`} material={matDark} position={[0.42, 1.4, -1.15 + i * 1.15]}>
            <boxGeometry args={[0.015, 1.35, 0.62]} />
          </mesh>
        ))}
        <mesh material={matGalv} position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[1.1, 0.1, 3.6]} />
        </mesh>
      </group>
      <mesh material={matSteel} castShadow position={[8.15, 0.55, -0.35]}>
        <boxGeometry args={[1.1, 1.1, 0.85]} />
      </mesh>
    </group>
  );
}
