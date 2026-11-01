import React from "react";
import ErrorLayout from "./ErrorLayout";

export default function Unauthorized() {
  return (
    <ErrorLayout
      code="401"
      title="Yêu cầu đăng nhập để tiếp tục"
      actions={["login", "home"]}
    />
  );
}

