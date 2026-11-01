import React from "react";
import ErrorLayout from "./ErrorLayout";

export default function Maintenance() {
  return (
    <ErrorLayout
      code="503"
      title="Hệ thống đang bảo trì"
      actions={["retry", "home"]}
    />
  );
}

