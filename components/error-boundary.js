"use client";

import { Error } from "./error";
import { log } from "next-axiom";
import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    log.error("Error occurred in UI", { error, errorInfo });
    console.error(error);
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      return <Error error={this.state.error} />;
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
