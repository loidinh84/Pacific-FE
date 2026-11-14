import React from "react";
import ErrorLayout from "./ErrorLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function ServerError() {
  const { t } = useLanguage();
  return (
    <ErrorLayout
      code="500"
      title={t("errors.error500Title", "Sóng dữ làm gián đoạn máy chủ")}
      actions={["retry", "home"]}
    />
  );
}

