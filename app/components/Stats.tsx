import clsx from "clsx";

import type { PostWithImageAndStats } from "~/models/post.server";
import Number from "~/components/Number";
import { Graph } from "./Graph";

interface StatsProps {
  post: PostWithImageAndStats;
  shown: boolean;
}

export interface GraphProps {
  width: number;
  votes: number;
  total: number;
  lockedUp: boolean;
}

function Stats({ post, shown }: StatsProps) {
  const maxWidth = 128;
  const smashes = post.smashes;
  const passes = post.passes;
  const totalVotes = post.totalVotes;

  function revealWithShown(otherClasses?: string) {
    return clsx(
      otherClasses,
      "transition-opacity duration-300",
      !shown && "opacity-0"
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      {/* Top text */}
      <span className={revealWithShown()}>
        What others chose for{" "}
        <span
          className={clsx(
            "font-bold",
            post.lockedUp ? "text-blue-dark" : "text-red"
          )}
        >
          {post.title}
        </span>
        {"..."}
      </span>

      <div className="flex w-full justify-center gap-4">
        {/* Graph left */}
        {shown && (
          <div
            className="flex flex-1 flex-col items-end gap-1 pt-2 text-right"
            style={{ width: maxWidth }}
          >
            <div>Oh No!</div>
            <Graph
              votes={passes}
              total={totalVotes}
              width={maxWidth}
              lockedUp
            />
            <div>
              <Number value={post.passes} />
            </div>
          </div>
        )}

        {/* Profile image */}
        <div
          className={clsx(
            "relative h-32 w-32 overflow-hidden rounded border-4",
            shown && (post.lockedUp ? "border-blue-dark" : "border-red")
          )}
        >
          <img
            className="h-full w-full object-cover"
            src={post.image}
            alt={post.title}
          />
        </div>

        {/* Graph right */}
        {shown && (
          <div
            className="flex flex-1 flex-col gap-1 pt-2"
            style={{ width: maxWidth }}
          >
            <div>Ay Yo!</div>
            <Graph
              votes={smashes}
              total={totalVotes}
              width={maxWidth}
              lockedUp={false}
            />
            <div>
              <Number value={post.smashes} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom text */}
      <span className={revealWithShown()}>
        <Number value={totalVotes} /> total votes
      </span>
    </div>
  );
}

export default Stats;
