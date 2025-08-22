import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DoubleSide,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
  VideoTexture,
  Vector3,
} from "three";
import video from "./mc2.mp4";
import mcAudio from "./mcSound.mp3";

import "./virtualMC1.scss";

function CameraController({ controlsRef }) {
  const { camera } = useThree();

  useEffect(() => {
    const timer = setTimeout(() => {
      const direction = new Vector3();
      camera.rotation.set(0, (-98 * Math.PI) / 180, 0);
      camera.getWorldDirection(direction);
      camera.getWorldPosition(controlsRef.current.target);
      controlsRef.current.target.addScaledVector(direction, 1);
      controlsRef.current.update();
    }, 0);

    return () => clearTimeout(timer);
  }, [camera, controlsRef]);

  return null;
}

function Box(props) {
  const ref = useRef();
  const texture = new TextureLoader().load(
    "https://platformfiles-staging.vizion.space/equi-hd/653b939b051d320144e2d373.jpeg"
  );

  return (
    <mesh {...props} ref={ref} scale={[-1, 1, 1]}>
      <sphereGeometry args={[10, 64, 32]} />
      <meshBasicMaterial side={DoubleSide} map={texture} />
    </mesh>
  );
}

function Plane(props) {
  const { camera } = useThree();
  const ref = useRef();
  const [videoTexture, setVideoTexture] = useState();
  const fragmentShader = useMemo(
    () => `uniform vec3 keyColor;
  uniform float similarity;
  uniform float smoothness;
  varying vec2 vUv;
  uniform sampler2D map;
  void main() {

      vec4 videoColor = texture2D(map, vUv);

      float Y1 = 0.299 * keyColor.r + 0.587 * keyColor.g + 0.114 * keyColor.b;
      float Cr1 = keyColor.r - Y1;
      float Cb1 = keyColor.b - Y1;

      float Y2 = 0.299 * videoColor.r + 0.587 * videoColor.g + 0.114 * videoColor.b;
      float Cr2 = videoColor.r - Y2;
      float Cb2 = videoColor.b - Y2;

      float blend = smoothstep(similarity, similarity + smoothness, distance(vec2(Cr2, Cb2), vec2(Cr1, Cb1)));
      gl_FragColor = vec4(videoColor.rgb, videoColor.a * blend);
  }`,
    []
  );

  const vertexShader = useMemo(
    () =>
      `varying vec2 vUv;
  void main( void ) {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`,
    []
  );

  useEffect(() => {
    if (ref && ref.current) {
      const video = document.getElementById("video");

      const texture = new VideoTexture(video);
      texture.colorSpace = SRGBColorSpace;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;

      ref.current.lookAt(camera.position);

      setVideoTexture(texture);
    }
  }, [camera.position, setVideoTexture]);

  const mcMesh = useMemo(
    () => (
      <>
        <mesh {...props} ref={ref} scale={[-1, 1, 1]}>
          <planeGeometry args={[9, 5]} />
          <shaderMaterial
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            uniforms={{
              map: { value: videoTexture },
              keyColor: { value: [0.0, 1.0, 0.0] },
              similarity: { value: 0.74 },
              smoothness: { value: 0.0 },
            }}
            transparent
          />
        </mesh>
      </>
    ),
    [fragmentShader, vertexShader, vertexShader, videoTexture]
  );

  return <> {mcMesh}</>;
}

function DemoVirtualMC3D() {
  const backgroundAudioRef = useRef();
  const mcAudioRef = useRef();
  const mcRef = useRef();
  const controlsRef = useRef();
  const [played, setPlayed] = useState(false);

  const playAudio = useCallback(() => {
    setPlayed(!played);
    if (!played) {
      backgroundAudioRef.current.play();
      mcRef.current.play();
      mcAudioRef.current.play();
    }
  }, [played]);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <CameraController controlsRef={controlsRef} />
        <Box position={[0, 0, 0]} />
        <OrbitControls ref={controlsRef} rotateSpeed={-0.5} />
        <Plane position={[8, 0.68, 2]} mcAudioRef={mcAudioRef} />
      </Canvas>
      <div
        className="welcome"
        style={{
          display: `${played ? "none" : ""}`,
        }}
      >
        <button onClick={playAudio}>Start Demo</button>
      </div>
      <video muted playsInline id="video" ref={mcRef}>
        <source src={video} />
      </video>
      <audio loop ref={backgroundAudioRef}>
        <source src="https://platformfiles-staging.vizion.space/audio/607c4970-2610-432b-a761-59f5363d136b" />
      </audio>
      <audio ref={mcAudioRef}>
        <source src={mcAudio} />
      </audio>
    </>
  );
}

export default DemoVirtualMC3D;
