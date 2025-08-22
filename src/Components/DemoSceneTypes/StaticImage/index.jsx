import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useRef } from "react";
import { DoubleSide, TextureLoader, Vector2 } from "three";
import { setCamera } from "../utils";

function calculateVisibleWidthAtDistance(distance, camera) {
  // Chuyển đổi góc FOV từ độ sang radian
  const vFOV = (camera.fov * Math.PI) / 180;

  // Tính chiều cao nhìn thấy ở khoảng cách đó
  const height = 2 * Math.tan(vFOV / 2) * distance;

  // Sử dụng tỷ lệ khung hình của camera để tính chiều rộng
  const width = height * camera.aspect;

  return width;
}

function calculatePanLimits(objectWidth, objectHeight, camera, distance) {
  const visibleWidth = calculateVisibleWidthAtDistance(distance, camera);
  const visibleHeight = visibleWidth / camera.aspect;

  let limitX = Math.max(objectWidth / 2 - visibleWidth / 2, 0);
  let limitY = Math.max(objectHeight / 2 - visibleHeight / 2, 0);

  return { limitX, limitY };
}

function StaticScene({ sceneData, controlsRef }) {
  const ref = useRef();
  const texture = new TextureLoader().load(sceneData.imageUrl);

  const { camera, scene, raycaster } = useThree();

  useEffect(() => {
    setCamera(camera, sceneData.cameraPos, 75);
  }, []);

  useEffect(() => {
    controlsRef.current.addEventListener("change", function () {
      const distance = camera.position.distanceTo(this.target);

      const { limitX, limitY } = calculatePanLimits(
        sceneData.imageSize.width / 100,
        sceneData.imageSize.height / 100,
        camera,
        distance
      );

      // Áp dụng giới hạn cho việc pan
      this.target.x = Math.max(Math.min(this.target.x, limitX), -limitX);
      camera.position.x = Math.max(
        Math.min(camera.position.x, limitX),
        -limitX
      );

      // Đối với pan dọc, bạn có thể áp dụng tương tự nếu cần
      this.target.y = Math.max(Math.min(this.target.y, limitY), -limitY);
      camera.position.y = Math.max(
        Math.min(camera.position.y, limitY),
        -limitY
      );
    });
  }, []);

  useEffect(() => {
    const onMouseMove = (event) => {
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
      <mesh position={[0, 0, 0]} ref={ref}>
        <planeGeometry
          args={[
            sceneData.imageSize.width / 100,
            sceneData.imageSize.height / 100,
          ]}
        />
        <meshBasicMaterial side={DoubleSide} map={texture} />
      </mesh>
    </>
  );
}

export default StaticScene;
