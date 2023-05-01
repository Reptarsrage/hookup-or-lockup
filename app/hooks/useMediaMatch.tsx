import { useEffect, useMemo, useState } from "react";

/**
 * useMediaMatch
 *
 * A react hook that signals whether or not a media query is matched.
 *
 * @param query The media query to signal on. Example, `"print"` will signal
 * `true` when previewing in print mode, and `false` otherwise.
 * @returns Whether or not the media query is currently matched.
 * @see https://rooks.vercel.app/docs/useMediaMatch
 */
export default function useMediaMatch(
  query: string,
  initialValue: boolean
): boolean {
  const matchMedia = useMemo<MediaQueryList | undefined>(
    () =>
      typeof window === "undefined" ? undefined : window.matchMedia(query),
    [query]
  );

  const [matches, setMatches] = useState<boolean>(
    () => matchMedia?.matches ?? initialValue
  );

  useEffect(() => {
    if (!matchMedia) {
      return;
    }

    setMatches(matchMedia.matches);
    const listener = (event: MediaQueryListEventMap["change"]) =>
      setMatches(event.matches);

    if (matchMedia.addEventListener) {
      matchMedia.addEventListener("change", listener);
      return () => matchMedia.removeEventListener("change", listener);
    } else {
      matchMedia.addListener(listener);
      return () => matchMedia.removeListener(listener);
    }
  }, [matchMedia, initialValue]);

  if (typeof window === "undefined") {
    return initialValue;
  }

  return matches;
}
