import * as React from "react";
import {
  useSpring,
  useChain,
  useSpringRef,
  animated,
  config,
} from "@react-spring/web";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import type { PostWithImageAndStats } from "~/models/post.server";
import Stats from "./Stats";
import clsx from "clsx";
import { useSsrCompatible } from "~/hooks/useSsrCompatible";

type ResultsProps = {
  decision: number;
  post: PostWithImageAndStats;
  onGoNext: () => void;
};

function Results({ onGoNext: closeResults, post, decision }: ResultsProps) {
  const [innerHeight, innerWidth] = useSsrCompatible(useWindowSize(), [0, 0]);
  const [reveal, setShowConfetti] = React.useState(false);

  // Spring for card shake & grow
  const growRef = useSpringRef();
  const growStyle = useSpring({
    ref: growRef,
    from: { scale: 0 },
    to: { scale: 1 },
    delay: 200,
    config: config.wobbly,
  });

  // Spring for stamp fly-in
  const flyInRef = useSpringRef();
  const flyInStyle = useSpring({
    ref: flyInRef,
    from: {
      opacity: 0,
      y: -1000,
      x: 1000,
    },
    to: { opacity: 1, y: 0, x: 0 },
    config: { ...config.gentle, clamp: true },
  });

  // Spring for stamp splat
  const splatRef = useSpringRef();
  const splatStyle = useSpring({
    ref: splatRef,
    from: { x: 0 },
    x: 1,
    onResolve: () => {
      setShowConfetti(true);
    },
  });

  useChain([growRef, flyInRef, splatRef]);

  const isLockedUp = post.lockedUp;
  const choseLockedUp = decision < 0;
  const isCorrect = isLockedUp === choseLockedUp;

  let size = 1000;
  if (innerWidth && innerHeight) {
    size = Math.sqrt(Math.pow(innerWidth, 2) + Math.pow(innerHeight, 2));
  }

  function revealed(otherClasses?: string, reverse = false) {
    const shown = reverse ? reveal : !reveal;

    return clsx(
      otherClasses,
      "transition-opacity duration-300",
      shown && "opacity-0"
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col py-16 px-8">
      {reveal && (
        <Confetti
          width={innerWidth}
          height={innerHeight}
          run={isCorrect}
          numberOfPieces={100}
        />
      )}

      <header className={revealed("flex flex-col items-center")}>
        <h1 className="text-5xl">{isCorrect ? "Correct" : "Incorrect"}!</h1>
        <h4 className="text-xl">
          {post.title} is
          <b className={clsx(isLockedUp ? "text-blue-dark" : "text-red")}>
            {isLockedUp ? " in jail " : " not in jail"}
          </b>
        </h4>
      </header>

      <div
        className={revealed(
          "absolute top-1/2 left-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full",
          true
        )}
        style={{
          width: size,
          height: size,
          backgroundImage: "radial-gradient(#a8a6f5, #0b0a26, #0b0a26)",
        }}
      >
        <div
          className="animate-[spin_10s_linear_infinite] rounded-full bg-cover bg-center bg-no-repeat"
          style={{
            width: size,
            height: size,
            backgroundImage: "url('/rays.svg')",
          }}
        ></div>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center">
        <animated.div
          className="relative will-change-transform"
          style={growStyle}
        >
          <Stats post={post} shown={reveal} />

          <animated.div
            className="absolute top-0 left-0 flex h-full w-full items-center justify-center"
            style={{
              ...flyInStyle,
              scale: splatStyle.x.to({
                range: [0, 0.95, 1],
                output: [0.9, 1.4, 1],
              }),
            }}
          >
            <div className={revealed(undefined, true)}>
              {isLockedUp ? (
                <img width="128" height="128" src="/oh-no.svg" alt="Oh No" />
              ) : (
                <img width="128" height="128" src="/ay-yo.svg" alt="Ay Yo" />
              )}
            </div>
          </animated.div>
        </animated.div>
      </main>

      <footer className={revealed("flex flex-col items-center")}>
        <button
          disabled={!open}
          onClick={closeResults}
          className="m-auto inline-block cursor-pointer rounded-xl border-none bg-pink px-8 py-3 text-lg font-medium text-white outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
        >
          Next
        </button>
      </footer>
    </div>
  );
}

export default Results;
