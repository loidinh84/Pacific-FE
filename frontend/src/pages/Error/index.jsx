import React from "react";
import { useParams } from "react-router-dom";
import ErrorLayout from "./ErrorLayout";
import NotFound from "./NotFound";
import Forbidden from "./Forbidden";
import Unauthorized from "./Unauthorized";
import ServerError from "./ServerError";
import Maintenance from "./Maintenance";
import Offline from "./Offline";
import ErrorBoundary from "./ErrorBoundary";

export function GenericErrorPage() {
  const { code } = useParams();

  switch (code) {
    case "401":
      return <Unauthorized />;
    case "403":
      return <Forbidden />;
    case "500":
      return <ServerError />;
    case "503":
      return <Maintenance />;
    case "offline":
      return <Offline />;
    case "404":
    default:
      return <NotFound />;
  }
}

export {
  ErrorLayout,
  NotFound,
  Forbidden,
  Unauthorized,
  ServerError,
  Maintenance,
  Offline,
  ErrorBoundary,
};

