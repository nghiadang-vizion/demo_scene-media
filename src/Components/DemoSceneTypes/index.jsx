import { MapControls, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";
import Jumpspot from "./Components/Jumspot";
import MediaSpot from "./Components/Mediaspot";
import CubeScene from "./Cube";
import { DATA } from "./data";
import PanoramaScene from "./Panorama";
import StaticScene from "./StaticImage";
import Plane from "./Plane";
import BackButton from "./BackButton";
import PDFPopup from "../PDFPopup";
import VideoPopup from "../VideoPopup";
import GifAudioPopup from "../GifAudioPopup";
import FlipbookPopup from "../FlipbookPopup";
import IntroVideo from "../IntroVideo";

function DemoSceneTypes() {
  const [currentScene, setCurrentScene] = useState(DATA[2]);
  console.log("🚀 ~ DemoSceneTypes ~ currentScene:", currentScene);
  const controlsRef = useRef();
  const mcRef = useRef();
  const video = "mc2.mp4";
  const [isPDFPopupOpen, setIsPDFPopupOpen] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [isGifAudioPopupOpen, setIsGifAudioPopupOpen] = useState(false);
  const [isFlipbookPopupOpen, setIsFlipbookPopupOpen] = useState(false);
  const [IsDone, setIsDone] = useState(false);

  useEffect(() => {
    setIsDone(false);
  }, [currentScene]);

  const orbitSettings = useMemo(() => {
    if (currentScene.sceneType === "panorama") {
      return {
        minPolar: degToRad(78),
        maxPolar: degToRad(102),
        minAzimuth: currentScene.zoom === 1 ? Math.PI / 3.5 : -Math.PI / 1.55,
        maxAzimuth:
          currentScene.zoom === 1
            ? currentScene.angle - Math.PI / 3.5
            : currentScene.angle + Math.PI / 1.185,
      };
    }
    return {
      minPolar: 0,
      maxPolar: Math.PI,
      minAzimuth: Infinity,
      maxAzimuth: Infinity,
    };
  }, [currentScene]);

  useEffect(() => {
    if (mcRef.current.paused) {
      mcRef.current.play();
    }
  }, []);

  return (
    <>
      <Canvas
        camera={{
          far: 5000,
          zoom: 1,
          fov: 50,
        }}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        {currentScene.sceneType === "cube" ? (
          <CubeScene sceneData={currentScene} />
        ) : currentScene.sceneType === "panorama" ? (
          <PanoramaScene sceneData={currentScene} />
        ) : (
          <StaticScene sceneData={currentScene} controlsRef={controlsRef} />
        )}
        {currentScene.sceneType === "static" ? (
          <MapControls
            ref={controlsRef}
            enableDamping={true}
            dampingFactor={1}
            screenSpacePanning={true}
            enableZoom={true}
            enableRotate={false}
            maxDistance={11}
            minDistance={3}
          />
        ) : (
          <OrbitControls
            rotateSpeed={-0.25}
            minPolarAngle={orbitSettings.minPolar}
            maxPolarAngle={orbitSettings.maxPolar}
            minAzimuthAngle={orbitSettings.minAzimuth}
            maxAzimuthAngle={orbitSettings.maxAzimuth}
          />
        )}
        {currentScene.hpPosition.length > 0 &&
          currentScene.hpPosition.map((item, index) => (
            <Jumpspot
              sceneData={item}
              setCurrentScene={setCurrentScene}
              key={index}
              position={item.positon}
            />
          ))}
        {currentScene.mediaPos.position && (
          <MediaSpot
            sceneData={currentScene}
            mediaType={currentScene.mediaPos.type}
            setIsPDFPopupOpen={setIsPDFPopupOpen}
            setIsVideoPopupOpen={setIsVideoPopupOpen}
            setIsGifAudioPopupOpen={setIsGifAudioPopupOpen}
            setIsFlipbookPopupOpen={setIsFlipbookPopupOpen}
          />
        )}
        <Plane position={[-10.8666798139661, 95.43399402176209, 400]} />
      </Canvas>
      <video muted playsInline id="video" ref={mcRef} loop>
        <source src={video} />
      </video>

      {currentScene.id !== "scene3" && (
        <BackButton
          setCurrentScene={setCurrentScene}
          currentScene={currentScene}
        />
      )}
      {isPDFPopupOpen && (
        <PDFPopup
          isOpen={isPDFPopupOpen}
          onClose={() => setIsPDFPopupOpen(false)}
          pdfUrl={"magazine.pdf"}
        />
      )}
      {isVideoPopupOpen && (
        <VideoPopup
          isOpen={isVideoPopupOpen}
          onClose={() => setIsVideoPopupOpen(false)}
          videoSrc={"video-p2.mp4"}
          title={"Tạp chí cộng sản"}
        />
      )}
      {isGifAudioPopupOpen && (
        <GifAudioPopup
          isOpen={isGifAudioPopupOpen}
          onClose={() => setIsGifAudioPopupOpen(false)}
          gifSrc={"gif.webp"}
          audioSrc={"book-audio.mp3"}
        />
      )}
      {isFlipbookPopupOpen && (
        <FlipbookPopup
          isOpen={isFlipbookPopupOpen}
          onClose={() => setIsFlipbookPopupOpen(false)}
          pdfUrl={"magazine2.pdf"}
          title="Tạp chí 3D"
        />
      )}

      {currentScene.id === "scene5" && (
        <IntroVideo
          setIsDone={setIsDone}
          IsDone={IsDone}
          videoSrc={"open-door.mp4"}
          isFinalScene={true}
        />
      )}

      {/* <audio ref={mcAudioRef}>
        <source src={mcAudio} />
      </audio> */}
    </>
  );
}

export default DemoSceneTypes;
