import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { LinearFilter, SRGBColorSpace, VideoTexture } from "three";

export default function Plane(props) {
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
  
        float chromaDist = distance(vec2(Cr2, Cb2), vec2(Cr1, Cb1));
        float blend = smoothstep(similarity, similarity + smoothness, chromaDist);
        
        // Discard pixel completely if it's too close to key color
        if (blend < 0.1) {
            discard;
        }
        
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
          <planeGeometry args={[470, 300]} />
          <shaderMaterial
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            uniforms={{
              map: { value: videoTexture },
              keyColor: { value: [0.0, 1.0, 0.0] },
              similarity: { value: 0.5 },
              smoothness: { value: 0.1 },
            }}
            transparent
          />
        </mesh>
      </>
    ),
    [fragmentShader, props, vertexShader, videoTexture]
  );

  return <>{mcMesh}</>;
}
