import React from "react";
import ErrorLayout from "./ErrorLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <ErrorLayout
      code="404"
      title={t("errors.error404Title", "Bạn đã lạc vào vùng chưa được khám phá")}
      actions={["home", "back"]}
    />
  );
}

