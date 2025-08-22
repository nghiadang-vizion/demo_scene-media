import { useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { DoubleSide, TextureLoader, Vector2, Vector3 } from "three";
import { setCamera } from "../utils";

function PanoramaScene({ sceneData }) {
  console.log("🚀 ~ PanoramaScene ~ sceneData:", sceneData);
  const ref = useRef();
  const texture = useMemo(
    () => new TextureLoader().load(sceneData.imageUrl),
    [sceneData.imageUrl]
  );
  const { camera, raycaster, scene } = useThree();

  useEffect(() => {
    setCamera(camera, sceneData.cameraPos, 50);
  }, [sceneData, camera]);

  useEffect(() => {
    const onMouseMove = (event) => {
      // console.log(camera.position);
      const mouse = new Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([ref.current]);
      console.log("🚀 ~ onMouseMove ~ intersects:", intersects);
    };

    document.body.addEventListener("click", onMouseMove);
    return () => document.body.removeEventListener("click", onMouseMove);
  }, [camera, raycaster, scene]);

  return (
    <>
      <mesh position={[0, 0, 0]} ref={ref} scale={[-1, 1, 1]}>
        <cylinderGeometry
          args={[
            sceneData.imageSize.width / (2 * Math.PI),
            sceneData.imageSize.width / (2 * Math.PI),
            (sceneData.zoom === 0.5 ? 1 : 0.7) * sceneData.imageSize.height,
            64,
            32,
            true,
            0,
            sceneData.angle,
          ]}
        />
        <meshStandardMaterial side={DoubleSide} map={texture} />
      </mesh>
      <ambientLight intensity={3} />
    </>
  );
}

export default PanoramaScene;
