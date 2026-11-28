import { useRef, useState } from "react";
import { Search, Camera, X } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const SUGGESTIONS = [
  { vi: "Sinh vật phát sáng ở biển sâu", en: "Bioluminescent deep sea fish" },
  { vi: "So sánh cá mập voi và cá voi xanh", en: "Compare whale shark and blue whale" },
  { vi: "Vì sao sao biển gai hại san hô?", en: "Why do crown-of-thorns harm coral?" },
  { vi: "Con cá nào to nhất đại dương", en: "Largest fish in the ocean" },
  { vi: "Thiên địch của sao biển gai", en: "Crown-of-thorns predators" },
  { vi: "Loài ăn cỏ biển ở Côn Đảo", en: "Seagrass grazers in Con Dao" },
];

/**
 * Thu gọn kích thước ảnh trên trình duyệt (tối đa 1024px, JPEG 0.82) để tải nhanh & ổn định
 */
function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc tệp hình ảnh."));
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();
      img.onerror = () => reject(new Error("Tệp không phải hình ảnh hợp lệ."));
      img.onload = () => {
        const MAX_DIM = 1024;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
        resolve({
          previewUrl: compressedDataUrl,
          imageBase64: compressedDataUrl,
          mimeType: "image/jpeg",
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function SearchHeroHeader({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  onImageSearch,
  imagePreview,
  onClearImage,
  imageLoading = false,
}) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");

  const processSelectedFile = async (file) => {
    if (!file || !onImageSearch) return;
    setImageError("");
    if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
      setImageError(
        isEn
          ? "Please choose a JPG, PNG, or WebP image."
          : "Vui lòng chọn ảnh định dạng JPG, PNG hoặc WebP."
      );
      return;
    }
    try {
      const compressed = await compressImageFile(file);
      onImageSearch(compressed);
    } catch (err) {
      setImageError(err.message || (isEn ? "Invalid image file." : "Không thể đọc tệp ảnh."));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) processSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          processSelectedFile(file);
          break;
        }
      }
    }
  };

  return (
    <div id="search-hero" className="text-center max-w-4xl mx-auto pt-20 pb-3 sm:pt-24 sm:pb-4 md:pt-28 md:pb-6 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f172a] font-heading tracking-tight mb-2">
        {t("searchPage.heroTitle")}
      </h1>

      <p className="text-xs sm:text-sm text-[#334155] max-w-xl mx-auto mb-4 sm:mb-6 font-normal leading-relaxed">
        {t("searchPage.heroDesc")}
      </p>

      <form
        onSubmit={onSearchSubmit}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="relative max-w-2xl mx-auto mb-4"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          aria-label={isEn ? "Upload marine species photo" : "Tải ảnh sinh vật biển"}
        />

        <div
          className={`relative flex items-center rounded-xl transition-all ${
            isDragging ? "ring-2 ring-[#0284c7] bg-sky-50/70" : ""
          }`}
        >
          <Search
            size={17}
            className="absolute left-3.5 sm:left-4 text-[#475569] pointer-events-none z-10"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPaste={handlePaste}
            placeholder={
              isDragging
                ? isEn
                  ? "Drop an image here to identify..."
                  : "Thả ảnh sinh vật biển vào đây để nhận diện..."
                : t("searchPage.searchPlaceholder")
            }
            className="w-full py-3 sm:py-3.5 pl-10 sm:pl-11 pr-28 sm:pr-40 liquid-glass-strong rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder:text-[#475569] focus:outline-none focus:border-[#0284c7] focus:ring-2 focus:ring-sky-500/15 transition-colors"
          />

          <div className="absolute right-1.5 flex items-center gap-1 sm:gap-1.5 z-10">
            {onImageSearch && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageLoading}
                title={isEn ? "Search by image (or paste/drop)" : "Tìm kiếm bằng hình ảnh (chọn, kéo thả hoặc dán Ctrl+V)"}
                className="p-1.5 sm:p-2 rounded-lg text-[#475569] hover:text-[#0284c7] hover:bg-[#0f172a]/5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Camera size={17} />
              </button>
            )}
            <button
              type="submit"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            >
              {t("searchPage.btnSearch")}
            </button>
          </div>
        </div>

        {/* Xem trước ảnh đang dùng để tìm kiếm */}
        {imagePreview && (
          <div className="mt-3 inline-flex max-w-full items-center gap-2.5 sm:gap-3 px-3 py-2 rounded-xl liquid-glass-subtle text-left">
            <img
              src={imagePreview}
              alt={isEn ? "Uploaded query" : "Ảnh đang tìm kiếm"}
              className="w-10 h-10 rounded-lg object-cover border border-[#0f172a]/10 shrink-0"
            />
            <span className="text-xs font-medium text-[#334155]">
              {imageLoading
                ? isEn
                  ? "Identifying marine species from photo..."
                  : "Đang nhận diện sinh vật biển từ hình ảnh..."
                : isEn
                  ? "Searching by uploaded photo"
                  : "Đang hiển thị kết quả từ hình ảnh"}
            </span>
            {onClearImage && (
              <button
                type="button"
                onClick={onClearImage}
                className="p-1 rounded-md text-[#475569] hover:text-[#0f172a] hover:bg-[#0f172a]/6 transition-colors cursor-pointer"
                title={isEn ? "Clear photo" : "Xóa ảnh"}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {imageError && (
          <p className="mt-2 text-xs text-rose-700 font-medium">{imageError}</p>
        )}

        {/* Static realistic suggestion chips: single horizontal swipe row on mobile, centered wrap on desktop */}
        <div className="flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-1.5 mt-3 overflow-x-auto sm:overflow-visible scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          <span className="text-xs text-[#475569] font-normal select-none shrink-0 mr-0.5">
            {isEn ? "Suggestions:" : "Gợi ý:"}
          </span>
          {SUGGESTIONS.map((item, idx) => {
            const text = isEn ? item.en : item.vi;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSearchTerm(text);
                  if (onSearchSubmit) {
                    setTimeout(() => onSearchSubmit({ preventDefault: () => {} }, text), 10);
                  }
                }}
                className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full liquid-glass-subtle hover:bg-white text-[#334155] hover:text-[#0284c7] text-xs font-medium transition-colors cursor-pointer"
              >
                {text}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
}
