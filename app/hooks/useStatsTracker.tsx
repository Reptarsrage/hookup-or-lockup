import { useMemo, useState } from "react";
import superjson from "superjson";
import type { PostWithImageAndStats } from "~/models/post.server";

type Decision = 1 | -1;

type Stats = {
  post: PostWithImageAndStats;
  decision: Decision;
  timeTaken: number;
};

export default function useStatsTracker() {
  function getStatsList(): Stats[] {
    if (typeof window === "undefined") {
      // session storage is not available on the server
      return [];
    }

    const statsList = window.sessionStorage.getItem("stats");
    if (statsList) {
      return superjson.parse<Stats[]>(statsList);
    } else {
      return [];
    }
  }

  const [stats, setStats] = useState<Stats[]>(getStatsList());

  function recordStats(stat: Stats) {
    const newStats = stats.concat(stat);
    window.sessionStorage.setItem("stats", superjson.stringify(newStats));
    setStats(newStats);
  }

  function clearStats() {
    window.sessionStorage.setItem("stats", superjson.stringify([]));
    setStats([]);
  }

  return useMemo(() => ({ stats, recordStats, clearStats }), [stats]);
}
