import type { HeadersFunction } from "@remix-run/server-runtime";
import NotFound from "~/components/NotFound";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export default function Splat() {
  return <NotFound />;
}
