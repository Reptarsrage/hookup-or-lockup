import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import type { PostWithImageAndStats } from "~/models/post.server";
import { getPosts } from "~/models/post.server";

function Number({ value }: { value: number }) {
  return <span>{value.toLocaleString()}</span>;
}

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

interface PostProps {
  post: PostWithImageAndStats;
}

interface StatsProps {
  post: PostWithImageAndStats | null;
}

function Post({ post }: PostProps) {
  return (
    <>
      <div className="relative">
        <img className="drag-none w-full" src={post.image} alt={post.title} />
        <h4 className="absolute bottom-0 left-0 m-0 w-full bg-gradient-to-t from-black p-2 text-2xl font-bold">
          {post.title}
        </h4>
      </div>

      <div className="overflow-y-auto px-4">
        <p className="text-base text-black">{post.description}</p>
      </div>
    </>
  );
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

export async function loader() {
  const page = await getPosts();
  return json({ page });
}

export default function GamePage() {
  const { page } = useLoaderData<typeof loader>();
  const { posts, total } = page;

  const [previous, setPrevious] = useState<PostWithImageAndStats | null>(null);

  const [count, setCount] = useState(1);
  const [gone] = useState(() => new Set<number>()); // The set flags all the cards that are flicked out

  function update(xDir = 0, idx = 0, active = false, mx = 0, vx = 0) {
    api.start((i) => {
      if (idx !== i) return; // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(posts[idx].id);
      const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
      const scale = active ? 1.1 : 1; // Active cards lift up a bit
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
      };
    });

    if (!active && gone.size === posts.length)
      setTimeout(() => {
        gone.clear();
        setCount(1);
        api.start((i) => to(i));
      }, 600);
  }

  function onSmash(idx?: number) {
    if (typeof idx === "undefined") {
      const last = posts.filter((post) => !gone.has(post.id));
      idx = posts.indexOf(last[last.length - 1]);
    }

    setCount(Math.min(count + 1, total));
    gone.add(posts[idx].id);
    setPrevious(posts[idx]);
    update(1, idx);
  }

  function onPass(idx?: number) {
    if (typeof idx === "undefined") {
      const last = posts.filter((post) => !gone.has(post.id));
      idx = posts.indexOf(last[last.length - 1]);
    }

    setCount(Math.min(count + 1, total));
    gone.add(posts[idx].id);
    setPrevious(posts[idx]);
    update(-1, idx);
  }

  const [props, api] = useSprings(posts.length, (i) => ({
    ...to(i),
    from: from(i),
  }));

  const bind = useDrag(
    ({
      args: [idx],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const trigger = vx > 0.2; // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) {
        if (xDir < 0) {
          onPass(idx);
        } else {
          onSmash(idx);
        }
      }

      update(xDir, idx, active, mx, vx);
    }
  );

  return (
    <div className="flex h-full flex-col">
      <div className="m-2 text-center text-lg">
        Viewing <Number value={count} /> of <Number value={total} />
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div
            className="absolute flex items-center justify-center will-change-transform"
            key={i}
            style={{ x, y, height: 500, width: 300 }}
          >
            <animated.div
              {...bind(i)}
              style={{
                transform: interpolate([rot, scale], trans),
                width: "45vh",
                height: "85vh",
                maxWidth: 300,
                maxHeight: 570,
              }}
              className="flex touch-none select-none flex-col gap-2 overflow-hidden rounded-xl bg-pink shadow-lg will-change-transform"
            >
              <Post post={posts[i]} />
            </animated.div>
          </animated.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-8 p-4">
        <button
          className="flex items-center justify-center rounded-md border-4 border-blue-dark bg-pink px-4 py-3 text-xl font-bold uppercase text-black hover:bg-pink-light"
          onClick={() => onPass()}
        >
          <span>Oh No!</span>
        </button>

        <button
          className="flex items-center justify-center rounded-md border-4 border-red bg-pink px-4 py-3 text-xl font-bold uppercase text-black hover:bg-pink-light"
          onClick={() => onSmash()}
        >
          <span>Ay Yo!</span>
        </button>
      </div>

      <div className="h-48">
        <Stats post={previous} />
      </div>
    </div>
  );
}
