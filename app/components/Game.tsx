import { useRef, useState } from "react";
import { to as interpolate, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import type { PostWithImageAndStats } from "~/models/post.server";
import Number from "~/components/Number";
import Post from "~/components/Post";
import useSize from "@react-hook/size";

const GUTTER = 16;

type Decision = -1 | 1;

type GameProps = {
  isLoading: boolean;
  post: PostWithImageAndStats;
  index: number;
  total: number;
  onDecisionMade: (decision: Decision) => void;
};

/**
 * Controls card animation.
 *
 * @param gone - if the card is gone
 * @param mx - x movement
 * @param xDir - x direction
 * @param active - if the card is being dragged
 * @param vx - x velocity
 * @param setDecision - setter for the decision state
 * @returns - animation properties
 */
function update(
  gone: boolean,
  mx: number,
  xDir: number,
  active: boolean,
  vx: number,
  setDecision: (val: number) => void
) {
  const x = gone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
  const rot = mx / 100 + (gone ? xDir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
  const scale = active ? 1.1 : 1; // Active cards lift up a bit

  if (active) {
    // User is dragging the card
    setDecision(Math.max(-1, Math.min(1, mx / (window.innerWidth / 3))));
  } else if (!gone) {
    // User let go of the card, but it isn't flying out yet
    setDecision(0);
  }

  return {
    x,
    rot,
    scale,
    config: {
      friction: 50,
      tension: active ? 800 : gone ? 200 : 500,
    },
  };
}

export default function Game({
  isLoading,
  onDecisionMade,
  post,
  index,
  total,
}: GameProps) {
  const [gone, setGone] = useState(false);
  const [decision, setDecision] = useState(0);

  const containerRef = useRef(null);
  const [, height] = useSize(containerRef);

  /**
   * When the user chooses smash or pass, animate card, record the decision and fetch more posts.
   */
  function decisionMade(decision: Decision) {
    // animate card out of the screen
    setDecision(decision);
    setGone(true);
    api.start(() =>
      update(true, decision * 999, decision, false, 0, setDecision)
    );

    // inform game of decision after card is gone
    setTimeout(() => {
      onDecisionMade(decision);
    }, 200);
  }

  // Spring to control card
  const [props, api] = useSpring(() => ({
    to: {
      x: 0,
      y: 0,
      rot: 0,
      scale: 1,
    },
    from: {
      x: 0,
      rot: 0,
      scale: 1.5,
      y: -1000,
    },
  }));

  // gestures to control card
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
      const decisionIsMade = Math.abs(mx) >= window.innerWidth / 3;
      const trigger = vx > 0.5;
      const directionMatchesDecision = mx < 0 === xDir < 0;
      if (!active && trigger && decisionIsMade && directionMatchesDecision) {
        if (xDir < 0) {
          decisionMade(-1);
          cancel();
        } else {
          decisionMade(1);
          cancel();
        }
      }

      api.start(() => update(gone, mx, xDir, active, vx, setDecision));
    }
  );

  const interactable = !(gone || isLoading);

  return (
    <>
      <div className="m-2 text-center text-lg">
        Viewing <Number value={index + 1} /> of <Number value={total} />
      </div>

      <div className="m-2 text-center text-lg">
        <h1 className="text-5xl font-semibold">{post.title}</h1>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center"
        ref={containerRef}
      >
        <Post
          {...(interactable ? bind() : {})}
          style={{
            transform: interpolate(
              [props.rot, props.scale],
              (r, s) => `rotate(${r}deg) scale(${s})`
            ),
            x: props.x,
            y: props.y,
            maxHeight: Math.min(600, height - GUTTER),
            aspectRatio: "2/3",
          }}
          className="absolute flex h-full touch-none select-none flex-col gap-2 overflow-hidden rounded-xl bg-pink shadow-lg will-change-transform"
          data-testid="card"
          post={post}
          decision={decision}
          isLoading={isLoading}
        />
      </div>

      <div className="flex items-center justify-center">
        <p className="max-h-[33vh] max-w-[600px] overflow-auto p-4">
          {post.description}
        </p>
      </div>

      <div className="hidden items-center justify-center gap-8 p-4 md:flex">
        <button
          className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-none bg-blue-light px-4 py-3 text-lg font-medium uppercase text-blue-dark outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
          disabled={!interactable}
          onClick={() => onDecisionMade(-1)}
          data-testid="oh-no"
        >
          <img width="64" height="64" src="/oh-no-dark.svg" alt="Oh No" />
          <span>Oh No!</span>
        </button>

        <button
          className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-none bg-pink px-4 py-3 text-lg font-medium uppercase text-red outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
          disabled={!interactable}
          onClick={() => onDecisionMade(1)}
          data-testid="ay-yo"
        >
          <img width="64" height="64" src="/ay-yo.svg" alt="Ay Yo" />
          <span>Ay Yo!</span>
        </button>
      </div>
    </>
  );
}
