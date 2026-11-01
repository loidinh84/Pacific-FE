import React from "react";
import ErrorLayout from "./ErrorLayout";

export default function Forbidden() {
  return (
    <ErrorLayout
      code="403"
      title="Quyền truy cập bị từ chối"
      actions={["home", "back"]}
    />
  );
}

