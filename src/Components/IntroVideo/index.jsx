import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

const IntroVideo = ({
  setIsDone,
  IsDone,
  videoSrc = "intro2.mp4",
  isFinalScene = false,
}) => {
  const videoRef = useRef(null);
  const [isShowButton, setIsShowButton] = useState(true);

  const handleVideoEnd = () => {
    console.log("Video đã chạy xong!");
    setIsDone(true);
  };

  const startVideo = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        await video.play();
        setIsShowButton(false);
      } catch (error) {
        console.log("Không thể phát video:", error);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video
        .play()
        .then(() => {})
        .catch(() => {});
    }
  }, []);

  return (
    <div
      className={`video-overlay ${IsDone ? "fade-out" : ""}`}
      style={{
        pointerEvents: IsDone ? "none" : "auto",
      }}
    >
      <div className="video-container">
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {isShowButton && !isFinalScene && (
          <div className="play-button" onClick={startVideo}>
            ▶ Bắt đầu tham quan
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroVideo;
