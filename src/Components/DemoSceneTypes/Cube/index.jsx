import { useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { DoubleSide, TextureLoader, Vector2 } from "three";
import { setCamera } from "../utils";
import CrossFadeMaterial from "../../Material";

function CubeScene({ sceneData }) {
  const ref = useRef();
  const textures = useMemo(
    () =>
      sceneData.imageUrl.size2048.map((item) => new TextureLoader().load(item)),
    []
  );

  const { camera, raycaster, scene } = useThree();

  window.camera = camera;

  useEffect(() => {
    setCamera(camera, sceneData.cameraPos, 75);
  }, []);

  useEffect(() => {
    const onMouseMove = (event) => {
      const mouse = new Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // const intersects = raycaster.intersectObjects([ref.current]);
      // console.log("🚀 ~ onMouseMove ~ intersects:", intersects[0].point);
    };

    document.body.addEventListener("click", onMouseMove);
    return () => document.body.removeEventListener("click", onMouseMove);
  }, [camera, raycaster, scene]);

  return (
    <>
      <mesh position={[0, 0, 0]} scale={[-1, 1, 1]} ref={ref}>
        <boxGeometry args={[1000, 1000, 1000]} />
        {textures.map((item, index) => (
          <CrossFadeMaterial
            texture1={item}
            texture2={null}
            mixFactor={0}
            opacity={1}
            index={index}
          />
        ))}
      </mesh>
    </>
  );
}

export default CubeScene;
