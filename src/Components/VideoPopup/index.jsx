import React, { useEffect, useRef } from "react";
import "./styles.scss";

const VideoPopup = ({ isOpen, onClose, videoSrc, title = "Video" }) => {
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Auto play video khi modal mở
      videoRef.current.play().catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Ngăn scroll khi modal mở
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleVideoEnd = () => {
    // Tự động đóng modal khi video kết thúc (tùy chọn)
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="video-popup-overlay" onClick={handleBackdropClick}>
      <div className="video-popup-modal" ref={modalRef}>
        <div className="video-popup-header">
          <h3 className="video-popup-title">{title}</h3>
          <button className="video-popup-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="video-popup-content">
          <video
            ref={videoRef}
            className="video-popup-player"
            controls
            autoPlay
            onEnded={handleVideoEnd}
          >
            <source src={videoSrc} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;
