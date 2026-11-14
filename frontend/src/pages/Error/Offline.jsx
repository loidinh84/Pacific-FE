import React from "react";
import ErrorLayout from "./ErrorLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function Offline() {
  const { t } = useLanguage();
  return (
    <ErrorLayout
      code="OFFLINE"
      watermark="NETWORK"
      title={t("errors.errorOfflineTitle", "Mất kết nối biển khơi")}
      actions={["retry", "home"]}
    />
  );
}

