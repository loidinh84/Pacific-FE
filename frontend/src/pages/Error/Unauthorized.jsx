import React from "react";
import ErrorLayout from "./ErrorLayout";
import { useLanguage } from "../../hooks/useLanguage";

export default function Unauthorized() {
  const { t } = useLanguage();
  return (
    <ErrorLayout
      code="401"
      title={t("errors.error401Title", "Yêu cầu đăng nhập để tiếp tục")}
      actions={["login", "home"]}
    />
  );
}

