import { createContext, useState } from "react";
import * as SJSON from "superjson";

import type { PostWithImageAndStats } from "~/models/post.server";

type Decision = 1 | -1;

export interface Stats {
  post: PostWithImageAndStats;
  decision: Decision;
  timeTaken: number;
}

export const StatsContext = createContext<{
  stats: Stats[];
  recordStats: (stat: Stats) => void;
  clearStats: () => void;
} | null>(null);

interface Props {
  children: React.ReactNode;
}

const StatsProvider = ({ children }: Props) => {
  function getStatsList(): Stats[] {
    if (typeof window === "undefined") {
      // session storage is not available on the server
      return [];
    }

    const statsList = window.sessionStorage.getItem("stats");
    if (statsList) {
      return SJSON.parse<Stats[]>(statsList);
    } else {
      return [];
    }
  }

  const [stats, setStats] = useState<Stats[]>(getStatsList());

  function recordStats(stat: Stats) {
    const newStats = [...stats].concat(stat);
    window.sessionStorage.setItem("stats", SJSON.stringify(newStats));
    setStats(newStats);
  }

  function clearStats() {
    window.sessionStorage.setItem("stats", SJSON.stringify([]));
    setStats([]);
  }

  return (
    <StatsContext.Provider value={{ stats, recordStats, clearStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export default StatsProvider;
