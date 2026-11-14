import React from "react";
import ErrorLayout from "./ErrorLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function Forbidden() {
  const { t } = useLanguage();
  return (
    <ErrorLayout
      code="403"
      title={t("errors.error403Title", "Khu vực giới hạn truy cập")}
      actions={["home", "back"]}
    />
  );
}

