import clsx from "clsx";

import type { PostWithImageAndStats } from "~/models/post.server";
import Number from "~/components/Number";

interface StatsProps {
  post: PostWithImageAndStats | null;
}

function Stats({ post }: StatsProps) {
  if (!post) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <div>
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
      </div>
      <div className="flex justify-center gap-4">
        <div className="flex flex-col items-end gap-1 pt-2 text-right">
          <div>Oh No!</div>
          <div className="h-8 w-32 rounded bg-blue-dark" />
          <div>
            <Number value={post.passes} />
          </div>
        </div>
        <div
          className={clsx(
            "relative h-32 w-32 overflow-hidden rounded border-4",
            post.lockedUp ? "border-blue-dark" : "border-red"
          )}
        >
          <img
            className="absolute h-full w-full opacity-80"
            src={post.lockedUp ? "/oh-no.svg" : "/ay-yo.svg"}
            alt={post.lockedUp ? "Oh No" : "Ay Yo"}
          />
          <img src={post.image} alt={post.title} />
        </div>
        <div className="flex flex-col gap-1 pt-2">
          <div>Ay Yo!</div>
          <div className="h-8 w-32 rounded bg-red" />
          <div>
            <Number value={post.smashes} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
