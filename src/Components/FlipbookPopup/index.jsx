import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./styles.scss";

const FlipbookPopup = ({
  isOpen,
  onClose,
  pdfUrl,
  pdfImages, // Prop mới để nhận array các ảnh PDF
  title = "Flipbook Viewer",
  width = 400,
  height = 600,
}) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pdfLibLoaded, setPdfLibLoaded] = useState(false);
  const flipBookRef = useRef(null);

  // Load PDF.js library
  useEffect(() => {
    const loadPDFJS = () => {
      if (window.pdfjsLib) {
        setPdfLibLoaded(true);
        return;
      }

      // Load PDF.js script
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          setPdfLibLoaded(true);
        }
      };
      script.onerror = () => {
        console.error("Failed to load PDF.js");
        setError("Không thể tải thư viện PDF");
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    loadPDFJS();
  }, []);

  // Sử dụng ảnh PDF được cung cấp từ bên ngoài
  useEffect(() => {
    if (pdfImages && pdfImages.length > 0) {
      const imagePages = pdfImages.map((imageUrl, index) => ({
        id: index + 1,
        image: imageUrl,
        type: "image",
      }));
      setPages(imagePages);
      setLoading(false);
      setError(null);
      return;
    }

    if (isOpen && pdfUrl && pdfLibLoaded) {
      loadPDFAsImages(pdfUrl);
    }
  }, [isOpen, pdfUrl, pdfImages, pdfLibLoaded]);

  // Chuyển đổi PDF thành ảnh sử dụng PDF.js
  const loadPDFAsImages = async (url) => {
    try {
      setLoading(true);
      setError(null);

      if (!window.pdfjsLib) {
        throw new Error("PDF.js library not loaded");
      }

      const loadingTask = window.pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const imagePages = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 2; // Tăng chất lượng ảnh
        const viewport = page.getViewport({ scale });

        // Tạo canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page lên canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Chuyển canvas thành base64 image
        const imageData = canvas.toDataURL("image/jpeg", 0.9);

        imagePages.push({
          id: pageNum,
          image: imageData,
          type: "image",
        });
      }

      setPages(imagePages);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Không thể tải PDF. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const handleNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const handlePageFlip = (e) => {
    setCurrentPage(e.data);
  };

  if (!isOpen) return null;

  return (
    <div className="flipbook-popup-overlay" onClick={handleOverlayClick}>
      <div className="flipbook-popup-modal">
        <div className="flipbook-popup-header">
          <h3 className="flipbook-popup-title">{title}</h3>
          <div className="flipbook-header-info">
            {pages.length > 0 && (
              <span className="page-counter">
                {currentPage + 1} / {pages.length}
              </span>
            )}
          </div>
          <button className="flipbook-popup-close" onClick={onClose}>
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

        <div className="flipbook-popup-content">
          {loading && (
            <div className="flipbook-loading">
              <div className="flipbook-spinner"></div>
              <p>
                {!pdfLibLoaded
                  ? "Đang tải thư viện PDF..."
                  : "Đang chuyển đổi PDF thành ảnh..."}
              </p>
            </div>
          )}

          {error && (
            <div className="flipbook-error">
              <p>{error}</p>
              <button
                onClick={() => loadPDFAsImages(pdfUrl)}
                className="retry-button"
              >
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && pages.length > 0 && (
            <div className="flipbook-container">
              <HTMLFlipBook
                ref={flipBookRef}
                width={width}
                height={height}
                size="fixed"
                minWidth={315}
                minHeight={400}
                maxWidth={800}
                maxHeight={1000}
                showCover={true}
                flippingTime={600}
                usePortrait={true}
                startZIndex={0}
                autoSize={true}
                maxShadowOpacity={1}
                showPageCorners={true}
                disableFlipByClick={false}
                className="flipbook"
                swipeDistance={30}
                clickEventForward={true}
                useMouseEvents={true}
                mobileScrollSupport={true}
                onFlip={handlePageFlip}
              >
                {pages.map((page, index) => (
                  <div key={page.id || index} className="flipbook-page">
                    <img
                      src={page.image}
                      alt={`Page ${index + 1}`}
                      className="page-image"
                      draggable={false}
                    />
                    <div className="page-number">{index + 1}</div>
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          )}

          {!loading && !error && pages.length === 0 && (
            <div className="flipbook-no-content">
              <p>Không có nội dung để hiển thị</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipbookPopup;
