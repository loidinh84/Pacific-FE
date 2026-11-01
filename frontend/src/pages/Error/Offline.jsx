import React from "react";
import ErrorLayout from "./ErrorLayout";

export default function Offline() {
  return (
    <ErrorLayout
      code="OFFLINE"
      watermark="NETWORK"
      title="Mất kết nối mạng"
      actions={["retry", "home"]}
    />
  );
}

