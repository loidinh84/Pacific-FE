/**
 * Utility cập nhật Favicon, Title và SEO Meta Tags theo thiết lập hệ thống thời gian thực
 */

export const updateDocumentFavicon = (iconUrl) => {
  if (!iconUrl) return;
  try {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconUrl;
    link.type = iconUrl.startsWith("data:image/svg") ? "image/svg+xml" : "image/png";
  } catch (err) {
    console.warn("Could not update favicon:", err);
  }
};

export const updateDocumentMetaSEO = ({ websiteName, seoDescription, logoUrl } = {}) => {
  try {
    // 1. Cập nhật Title & OpenGraph Title
    if (websiteName) {
      let ogTitle = document.querySelector("meta[property='og:title']");
      if (!ogTitle) {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = websiteName;
    }

    // 2. Cập nhật Meta Description & OpenGraph Description
    if (seoDescription) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = seoDescription;

      let ogDesc = document.querySelector("meta[property='og:description']");
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.content = seoDescription;
    }

    // 3. Cập nhật Favicon & OpenGraph Image
    if (logoUrl) {
      updateDocumentFavicon(logoUrl);

      let ogImage = document.querySelector("meta[property='og:image']");
      if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
      }
      ogImage.content = logoUrl;
    }
  } catch (err) {
    console.warn("Could not update meta SEO tags:", err);
  }
};

export const initSystemBranding = () => {
  try {
    const saved = localStorage.getItem("pacific_system_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.general) {
        updateDocumentMetaSEO(parsed.general);
      }
    }
  } catch (_) {}

  // Lắng nghe sự kiện cập nhật cấu hình toàn cục
  window.addEventListener("pacific_settings_update", (e) => {
    if (e.detail?.general) {
      updateDocumentMetaSEO(e.detail.general);
    }
  });
};
