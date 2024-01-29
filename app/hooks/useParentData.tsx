import { useMatches } from "@remix-run/react";

import type { Page } from "~/models/post.server";

export default function useParentData() {
  const matches = useMatches();
  const match = matches.find((m) => m.id === "routes/game.$idx");
  return (match?.data ?? { posts: [], total: 0 }) as Page;
}
