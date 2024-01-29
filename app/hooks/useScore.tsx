import { useContext, useMemo } from "react";
import { StatsContext, type Stats } from "../context/statsContext";

export default function useScore() {
  function calculateTimeTaken(stats: Stats[]) {
    return (
      stats.reduce((acc, stat) => acc + stat.timeTaken, 0) /
      stats.length /
      1000.0
    );
  }

  function calculatePercentCorrect(stats: Stats[]) {
    return Math.ceil(
      (stats.filter((stat) => (stat.decision === -1) === stat.post.lockedUp)
        .length /
        stats.length) *
        100.0,
    );
  }

  const { stats } = useContext(StatsContext);
  return useMemo(
    () => ({
      numberGuessed: stats.length,
      lockups: stats.filter((stat) => stat.decision === -1).length,
      hookups: stats.filter((stat) => stat.decision === 1).length,
      percentCorrect: calculatePercentCorrect(stats),
      numberCorrect: stats.filter(
        (stat) => (stat.decision === -1) === stat.post.lockedUp,
      ).length,
      averageTimeTaken: calculateTimeTaken(stats),
    }),
    [stats],
  );
}
