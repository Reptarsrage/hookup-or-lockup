import { createContext, useState } from "react";
import superjson from "superjson";
import type { PostWithImageAndStats } from "~/models/post.server";

type Decision = 1 | -1;

export type Stats = {
  post: PostWithImageAndStats;
  decision: Decision;
  timeTaken: number;
};

export const StatsContext = createContext<{
  stats: Stats[];
  recordStats: (stat: Stats) => void;
  clearStats: () => void;
}>({
  stats: [],
  recordStats: () => {},
  clearStats: () => {},
});

const StatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
    const newStats = [...stats].concat(stat);
    window.sessionStorage.setItem("stats", superjson.stringify(newStats));
    setStats(newStats);
  }

  function clearStats() {
    window.sessionStorage.setItem("stats", superjson.stringify([]));
    setStats([]);
  }

  return (
    <StatsContext.Provider value={{ stats, recordStats, clearStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export default StatsProvider;
