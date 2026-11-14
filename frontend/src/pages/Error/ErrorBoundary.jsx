import React from "react";
import ErrorLayout from "./ErrorLayout";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorLayout
          code="OOPS"
          watermark="ERROR"
          actions={["retry", "home"]}
        />
      );
    }

    return this.props.children;
  }
}

