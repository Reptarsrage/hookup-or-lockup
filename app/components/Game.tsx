import { useMediaQuery } from "@react-hook/media-query";
import useToggle from "@react-hook/toggle";
import clsx from "clsx";
import { useState } from "react";

import { AyYo, OhNo } from "~/components/icons";
import type { PostWithImageAndStats } from "~/models/post.server";

type Decision = -1 | 1;

interface GameProps {
  post: PostWithImageAndStats;
  onDecisionMade: (decision: Decision) => void;
}

function MobileCard({ post }: { post: PostWithImageAndStats }) {
  const [flipped, flip] = useToggle(false, true);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      flip();
    }
  }

  return (
    <div className="relative flex-auto w-full">
      <div className="absolute top-0 left-0 w-full h-full flex justify-center">
        <div
          data-testid="card"
          className=" flex flex-col bg-transparent aspect-h-card max-w-full max-h-full w-full h-full"
          style={{ perspective: "1000px" }}
        >
          <div
            className={clsx("relative w-full h-full")}
            onClick={flip}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 150ms",
            }}
          >
            {/* Front */}
            <div
              className="flex flex-col absolute w-full h-full bg-pink dark:bg-blue-dark text-red-dark dark:text-blue-lighter rounded-xl shadow-2xl overflow-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div
                className="flex flex-col flex-auto overflow-hidden relative bg-cover bg-top bg-no-repeat"
                style={{ backgroundImage: `url("${post.image}")` }}
              >
                <h1 className="px-4 py-2 text-5xl font-bold absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-darker text-pink-light dark:from-blue-dark dark:text-blue-lighter">
                  {post.title}
                </h1>
              </div>

              <div
                className="flex justify-end p-1 px-2 opacity-70"
                style={{ boxShadow: "inset 0 7px 9px -7px rgba(0,0,0,0.4)" }}
              >
                <em>Tap to see {flipped ? "picture" : "description"}</em>
              </div>
            </div>

            {/* Back */}
            <div
              className="flex flex-col absolute w-full h-full bg-pink dark:bg-blue-dark text-red-dark dark:text-blue-lighter rounded-xl shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <h1 className="px-4 py-2 text-5xl font-bold">{post.title}</h1>
              <p className="overflow-auto p-4 flex-1">{post.description}</p>
              <div
                className="flex justify-end p-1 px-2 opacity-70"
                style={{ boxShadow: "inset 0 7px 9px -7px rgba(0,0,0,0.4)" }}
              >
                <em>Tap to see {flipped ? "picture" : "description"}</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopCard({ post }: { post: PostWithImageAndStats }) {
  return (
    <div
      data-testid="card"
      className="flex max-h-[682px] w-full justify-stretch overflow-hidden rounded-xl bg-pink shadow-2xl dark:bg-blue-dark aspect-card max-w-3xl flex-grow-0 flex-row"
    >
      <div className="relative items-end aspect-h-card h-full flex">
        <img
          src={post.image}
          alt={post.title}
          className="absolute left-0 top-0 z-0 h-full w-full object-cover object-top"
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <h1 className="p-4 text-5xl font-bold text-red-dark dark:text-blue-lighter">
          {post.title}
        </h1>
        {/* TODO: Tags? */}
        <p className="flex-1 overflow-auto p-4 text-sm text-red-dark dark:text-blue-lighter">
          {post.description}
        </p>
      </div>
    </div>
  );
}

export default function Game({ onDecisionMade, post }: GameProps) {
  const [interactable] = useState(true);
  const isDesktop = useMediaQuery("only screen and (min-width: 768px)");
  const isLandscape = useMediaQuery("only screen and (orientation:landscape)");

  function ohNo() {
    onDecisionMade(-1);
  }

  function ayYo() {
    onDecisionMade(1);
  }

  // TODO: Loading skeleton

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 md:gap-8 items-center w-full">
        {isDesktop || isLandscape ? (
          <DesktopCard post={post} />
        ) : (
          <MobileCard post={post} />
        )}

        {/* Buttons */}
        <div className="flex w-full items-center justify-evenly gap-4 md:gap-8 md:p-4 max-w-3xl">
          <button
            className="whitespace-nowrap rounded-full bg-blue-light px-6 py-6 text-3xl font-semibold text-blue-dark outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm md:px-12 md:py-4 md:text-4xl"
            disabled={!interactable}
            onClick={ohNo}
            data-testid="oh-no"
          >
            <OhNo className="inline h-12 w-12 md:h-16 md:w-16" />
            <span className="ml-4 hidden md:ml-8 md:inline">Lockup</span>
          </button>

          <span className="text-3xl font-bold uppercase italic text-red-darker dark:text-gray-dark md:text-4xl">
            Or
          </span>

          <button
            className="whitespace-nowrap rounded-full bg-pink px-6 py-6 text-3xl font-semibold text-red-dark outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm md:px-12 md:py-4 md:text-4xl"
            disabled={!interactable}
            onClick={ayYo}
            data-testid="ay-yo"
          >
            <AyYo className="inline h-12 w-12 md:h-16 md:w-16" />
            <span className="ml-4 hidden md:ml-8 md:inline">Hookup</span>
          </button>
        </div>
      </main>
    </>
  );
}
