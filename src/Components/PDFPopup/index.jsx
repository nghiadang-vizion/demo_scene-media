import React, { useEffect } from "react";
import "./styles.scss";

const PDFPopup = ({ isOpen, onClose, pdfUrl, title = "PDF Viewer" }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="pdf-popup-overlay" onClick={handleOverlayClick}>
      <div className="pdf-popup-modal">
        <div className="pdf-popup-header">
          <h3 className="pdf-popup-title">{title}</h3>
          <button className="pdf-popup-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="pdf-popup-content">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              className="pdf-iframe"
              frameBorder="0"
            />
          ) : (
            <div className="pdf-no-content">
              <p>Không có PDF để hiển thị</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPopup;
