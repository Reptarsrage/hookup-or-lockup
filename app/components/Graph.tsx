import clsx from "clsx";
import { useSpring, animated, config } from "@react-spring/web";
import type { GraphProps } from "./Stats";

export function Graph({ width, votes, total, lockedUp }: GraphProps) {
  const passesStyle = useSpring({
    from: { width: 0 },
    to: { width: (votes / total) * width },
    config: config.wobbly,
  });

  return (
    <animated.div
      style={passesStyle}
      className={clsx("h-8 rounded ", lockedUp ? "bg-blue-dark" : "bg-red")}
    />
  );
}
