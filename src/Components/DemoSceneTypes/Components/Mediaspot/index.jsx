import { Html } from "@react-three/drei";
import React from "react";
import "./mediaSpot.scss";

function MediaSpot({
  sceneData,
  mediaType,
  setIsPDFPopupOpen,
  setIsVideoPopupOpen,
  setIsGifAudioPopupOpen,
  setIsFlipbookPopupOpen,
}) {
  return (
    <Html
      position={sceneData.mediaPos.position}
      scale={0.8}
      zIndexRange={[1, 0]}
      style={{
        transform: "translate(-50px, -150px)",
      }}
    >
      <div
        className="mdp_wrapper"
        onMouseEnter={() => (document.body.style.cursor = "pointer")}
        onMouseLeave={() => (document.body.style.cursor = "default")}
        onClick={() => {
          if (mediaType === "pdf") {
            setIsPDFPopupOpen(true);
          } else if (mediaType === "video") {
            setIsVideoPopupOpen(true);
          } else if (mediaType === "gif") {
            setIsGifAudioPopupOpen(true);
          } else if (mediaType === "flip-book") {
            setIsFlipbookPopupOpen(true);
          }
        }}
      >
        <img src="marker.png" height={200} width={100} />
      </div>
    </Html>
  );
}

export default MediaSpot;
