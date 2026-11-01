import React from "react";
import ErrorLayout from "./ErrorLayout";

export default function ServerError() {
  return (
    <ErrorLayout
      code="500"
      title="Lỗi máy chủ nội bộ"
      actions={["retry", "home"]}
    />
  );
}

