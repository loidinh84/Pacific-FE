import React from "react";
import ErrorLayout from "./ErrorLayout";

export default function NotFound() {
  return (
    <ErrorLayout
      code="404"
      title="Bạn đã lạc vào vùng chưa được khám phá"
      actions={["home", "back"]}
    />
  );
}

