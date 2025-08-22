import { Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useCallback } from "react";
import { DATA } from "../../data";
import Pulse from "../pulse";
import "./jumspot.scss";

function Jumpspot({ sceneData, setCurrentScene, position }) {
  const { camera } = useThree();

  const handleClickHp = useCallback(() => {
    console.log("🚀 ~ handleClickHp ~ sceneData.hpId:", sceneData.hpId);
    setCurrentScene(DATA[sceneData.hpId]);
    camera.position.set(0, 0, 11);
  }, [camera.position, sceneData.hpId, setCurrentScene]);

  return (
    <Html position={position} scale={0.8} zIndexRange={[1, 0]}>
      <div
        // className="hp_wrapper"
        onClick={handleClickHp}
        onMouseEnter={() => (document.body.style.cursor = "pointer")}
        onMouseLeave={() => (document.body.style.cursor = "default")}
        style={{
          transform: "translate(-50px, -150px)",
        }}
      >
        {/* <Pulse /> */}
        {/* <img src={sceneData.previewImgUrl} alt={sceneData.name} /> */}

        <img src="marker.png" height={200} width={100} />
      </div>
    </Html>
  );
}

export default Jumpspot;
