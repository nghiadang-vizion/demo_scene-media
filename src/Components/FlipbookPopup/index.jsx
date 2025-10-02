import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./styles.scss";

const FlipbookPopup = ({
  isOpen,
  onClose,
  title = "Flipbook Viewer",
  width = 400,
  height = 600,
}) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const flipBookRef = useRef(null);

  /*
   * CODE CŨ: Tải thư viện PDF.js để chuyển đổi PDF thành ảnh
   * Đã tạm thời vô hiệu hóa theo yêu cầu mới (hiển thị 4 trang custom)
   */
  // useEffect(() => {
  //   const loadPDFJS = () => {
  //     if (window.pdfjsLib) {
  //       setPdfLibLoaded(true);
  //       return;
  //     }
  //     const script = document.createElement("script");
  //     script.src =
  //       "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  //     script.onload = () => {
  //       if (window.pdfjsLib) {
  //         window.pdfjsLib.GlobalWorkerOptions.workerSrc =
  //           "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  //         setPdfLibLoaded(true);
  //       }
  //     };
  //     script.onerror = () => {
  //       console.error("Failed to load PDF.js");
  //       setError("Không thể tải thư viện PDF");
  //     };
  //     document.head.appendChild(script);
  //     return () => {
  //       if (document.head.contains(script)) {
  //         document.head.removeChild(script);
  //       }
  //     };
  //   };
  //   loadPDFJS();
  // }, []);

  // CẤU HÌNH MỚI: Tạo 4 trang (text, youtube, video local, ảnh)
  useEffect(() => {
    if (!isOpen) return;
    const customPages = [
      { id: 1, type: "text" },
      { id: 2, type: "youtube", youtubeId: "dQw4w9WgXcQ" },
      { id: 3, type: "video", src: "/mc2.mp4" },
      { id: 4, type: "image", src: "/img1.jpg" },
    ];
    setPages(customPages);
    setLoading(false);
    setError(null);
  }, [isOpen]);

  /*
   * CODE CŨ: Hàm chuyển PDF thành ảnh bằng PDF.js
   * Đã comment theo yêu cầu.
   */
  // const loadPDFAsImages = async (url) => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     if (!window.pdfjsLib) {
  //       throw new Error("PDF.js library not loaded");
  //     }
  //     const loadingTask = window.pdfjsLib.getDocument(url);
  //     const pdf = await loadingTask.promise;
  //     const imagePages = [];
  //     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //       const page = await pdf.getPage(pageNum);
  //       const scale = 2;
  //       const viewport = page.getViewport({ scale });
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");
  //       canvas.height = viewport.height;
  //       canvas.width = viewport.width;
  //       const renderContext = { canvasContext: context, viewport: viewport };
  //       await page.render(renderContext).promise;
  //       const imageData = canvas.toDataURL("image/jpeg", 0.9);
  //       imagePages.push({ id: pageNum, image: imageData, type: "image" });
  //     }
  //     setPages(imagePages);
  //   } catch (err) {
  //     console.error("Error loading PDF:", err);
  //     setError("Không thể tải PDF. Vui lòng thử lại.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
          {/* CODE CŨ: Loading khi xử lý PDF */}
          {/* {loading && (
            <div className="flipbook-loading">
              <div className="flipbook-spinner"></div>
              <p>
                {!pdfLibLoaded
                  ? "Đang tải thư viện PDF..."
                  : "Đang chuyển đổi PDF thành ảnh..."}
              </p>
            </div>
          )} */}

          {/* CODE CŨ: Hiển thị lỗi khi tải PDF thất bại */}
          {/* {error && (
            <div className="flipbook-error">
              <p>{error}</p>
              <button
                onClick={() => loadPDFAsImages(pdfUrl)}
                className="retry-button"
              >
                Thử lại
              </button>
            </div>
          )} */}

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
                    {page.type === "text" && (
                      <div
                        className="page-text"
                        style={{ padding: 24, color: "black" }}
                      >
                        <h2 style={{ marginBottom: 12 }}>Giới thiệu</h2>
                        <p>
                          Đây là trang văn bản demo. Bạn có thể đặt bất kỳ nội
                          dung giới thiệu, mô tả hoặc câu chuyện nào tại đây.
                        </p>
                      </div>
                    )}
                    {page.type === "youtube" && (
                      <div
                        className="page-youtube"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 12,
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: 0,
                            paddingBottom: "56.25%",
                          }}
                        >
                          <iframe
                            src={`https://www.youtube.com/embed/${page.youtubeId}`}
                            title="YouTube video"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              border: 0,
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                    {page.type === "video" && (
                      <div
                        className="page-video"
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 12,
                        }}
                      >
                        <video
                          src={page.src}
                          controls
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "100%",
                          }}
                        />
                      </div>
                    )}
                    {page.type === "image" && (
                      <img
                        src={page.src}
                        alt={`Page ${index + 1}`}
                        className="page-image"
                        draggable={false}
                      />
                    )}
                    <div className="page-number">{index + 1}</div>
                  </div>
                ))}

                {/* <div className="demoPage">
                  <h2>Trang 1</h2>
                  <p>Nội dung văn bản.</p>
                </div>

                <div className="demoPage">
                  <h2>Video demo</h2>
                  <video width="100%" controls>
                    <source
                      src="https://www.youtube.com/watch?v=0sVfBAO2ZJo"
                      type="video/mp4"
                    />
                    Trình duyệt không hỗ trợ video.
                  </video>
                </div>

                <div className="demoPage">
                  <h2>Trang 3</h2>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s"
                    alt="Demo"
                  />
                </div> */}
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
