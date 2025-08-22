import React, { useEffect, useRef } from "react";
import "./styles.scss";

const GifAudioPopup = ({
  isOpen,
  onClose,
  gifSrc,
  audioSrc,
  title = "Media Popup",
  autoPlayAudio = true,
}) => {
  const audioRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && audioRef.current && autoPlayAudio) {
      // Auto play audio khi modal mở
      audioRef.current.play().catch(console.error);
    }
  }, [isOpen, autoPlayAudio]);

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

  const handleAudioEnd = () => {
    // Có thể tự động đóng modal khi audio kết thúc (tùy chọn)
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="gif-audio-popup-overlay" onClick={handleBackdropClick}>
      <div className="gif-audio-popup-modal" ref={modalRef}>
        <div className="gif-audio-popup-header">
          <h3 className="gif-audio-popup-title">{title}</h3>
          <button className="gif-audio-popup-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="gif-audio-popup-content">
          {gifSrc && (
            <div className="gif-container">
              <img src={gifSrc} alt="Animated GIF" className="gif-image" />
            </div>
          )}

          {audioSrc && (
            <div className="audio-container">
              <audio
                ref={audioRef}
                className="audio-player"
                // controls
                autoPlay={autoPlayAudio}
                onEnded={handleAudioEnd}
              >
                <source src={audioSrc} type="audio/mpeg" />
                <source src={audioSrc} type="audio/wav" />
                <source src={audioSrc} type="audio/ogg" />
                Trình duyệt của bạn không hỗ trợ audio.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GifAudioPopup;
