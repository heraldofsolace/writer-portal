import React from "react";
import WriterPage from "./writer-page";

export default async function Page({ params }) {
  const { writerId } = params;
  return <WriterPage writerId={writerId} />;
}
