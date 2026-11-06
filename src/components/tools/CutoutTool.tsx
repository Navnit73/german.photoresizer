"use client";

import CutoutEditor from "./CutoutEditor";

/** P41: precise manual cut-out (lasso, polygon, brush) with optional AI pre-selection. */
export default function CutoutTool() {
  return <CutoutEditor variant="manual" />;
}
