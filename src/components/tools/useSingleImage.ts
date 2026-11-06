"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { decodeImage, sniffType, type DecodedImage, type SniffedType } from "@/lib/image/decode";

export interface LoadedImage extends DecodedImage {
  file: File;
}

/** Loads one image (with type check) and disposes the previous bitmap. */
export function useSingleImage(accept: SniffedType[], rejectMessage: string) {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = useRef<LoadedImage | null>(null);

  const load = useCallback(
    async (file: File) => {
      setError(null);
      const type = await sniffType(file);
      if (!accept.includes(type)) {
        setError(rejectMessage);
        return;
      }
      setLoading(true);
      try {
        const dec = await decodeImage(file);
        current.current?.bitmap.close();
        const next = { ...dec, file };
        current.current = next;
        setImage(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Die Datei konnte nicht geöffnet werden.");
      } finally {
        setLoading(false);
      }
    },
    [accept, rejectMessage],
  );

  const reset = useCallback(() => {
    current.current?.bitmap.close();
    current.current = null;
    setImage(null);
    setError(null);
  }, []);

  useEffect(() => () => current.current?.bitmap.close(), []);

  return { image, loading, error, setError, load, reset };
}
