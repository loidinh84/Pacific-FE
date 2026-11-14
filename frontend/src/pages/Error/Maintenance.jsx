import React from "react";
import ErrorLayout from "./ErrorLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function Maintenance() {
  const { t } = useLanguage();
  return (
    <ErrorLayout
      code="503"
      title={t("errors.error503Title", "Hệ thống đang bảo trì")}
      actions={["retry", "home"]}
    />
  );
}

