import { Suspense, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  DirectionalLight,
  Object3D,
  PMREMGenerator,
  Scene,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { incidentTint, plantWash, sampleCamera } from "../story/model";
import { storyState } from "../story/state";
import { PAPER, PLANT, WARM, matReactor } from "./materials";
import { Ontology } from "./Ontology";
import { Factory } from "./Factory";
import { Plant } from "./Plant";
import { Streams } from "./Streams";
import { SystemField } from "./Systems";

function Studio() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  useLayoutEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = texture;
    const target = scene as Scene & { environmentIntensity?: number };
    target.environmentIntensity = 0.32;
    return () => {
      texture.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

function KeyLight() {
  const light = useRef<DirectionalLight>(null);
  const target = useRef<Object3D>(null);
  useLayoutEffect(() => {
    if (light.current && target.current) light.current.target = target.current;
  }, []);
  return (
    <>
      <directionalLight
        ref={light}
        position={[16, 28, 14]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00022}
        shadow-normalBias={0.04}
        shadow-camera-near={4}
        shadow-camera-far={78}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={26}
        shadow-camera-bottom={-26}
      />
      <object3D ref={target} position={[0, 1.6, -1]} />
    </>
  );
}

function Director() {
  useFrame(({ scene }) => {
    const progress = storyState.progress;
    const wash = plantWash(progress);
    const tint = incidentTint(progress);
    for (const record of PLANT) {
      record.mat.color.copy(record.base).lerp(PAPER, wash * 0.9);
      record.mat.metalness = record.metalness * (1 - wash * 0.9);
      record.mat.roughness = Math.min(1, record.roughness + wash * 0.4);
      record.mat.envMapIntensity = record.env * (1 - wash * 0.8);
    }
    matReactor.color.set("#c9d1d8").lerp(WARM, tint * 0.72).lerp(PAPER, wash * 0.9);
    matReactor.metalness = 0.2 * (1 - wash);
    matReactor.roughness = 0.4 + wash * 0.4;
    const env = scene as Scene & { environmentIntensity?: number };
    if (typeof env.environmentIntensity === "number") {
      env.environmentIntensity = 0.32 * (1 - wash * 0.7);
    }
  });
  return null;
}

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const look = useRef(new Object3D());
  useFrame(() => {
    const { pos, look: target } = sampleCamera(storyState.progress);
    camera.position.set(pos[0], pos[1], pos[2]);
    look.current.position.set(target[0], target[1], target[2]);
    camera.lookAt(look.current.position);
  });
  return null;
}

export function Experience() {
  return (
    <Canvas
      className="webgl"
      shadows
      dpr={[1, 1.6]}
      camera={{ fov: 32, near: 0.2, far: 320, position: [68, 50, 86] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.96;
        gl.setClearColor("#f3f4f6");
      }}
    >
      <color attach="background" args={["#f3f4f6"]} />
      <fog attach="fog" args={["#f3f4f6", 70, 240]} />
      <hemisphereLight args={["#f7f8fa", "#b7c0c8", 0.38]} />
      <ambientLight intensity={0.12} />
      <KeyLight />
      <directionalLight position={[-14, 10, 8]} intensity={0.32} />
      <directionalLight position={[-4, 12, -18]} intensity={0.16} />
      <Studio />
      <Factory />
      <Plant />
      <Streams />
      <Suspense fallback={null}>
        <SystemField />
        <Ontology />
      </Suspense>
      <ContactShadows position={[0, 0.03, 0]} opacity={0.3} scale={46} blur={2.4} far={8} color="#8b949e" frames={1} />
      <Director />
      <CameraRig />
    </Canvas>
  );
}
