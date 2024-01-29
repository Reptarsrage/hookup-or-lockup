import { useState } from "react";
import useToggle from "@react-hook/toggle";
import { useMediaQuery } from "@react-hook/media-query";

import type { PostWithImageAndStats } from "~/models/post.server";
import { AyYo, OhNo } from "~/components/icons";
import clsx from "clsx";

type Decision = -1 | 1;

type GameProps = {
  post: PostWithImageAndStats;
  onDecisionMade: (decision: Decision) => void;
};

function MobileCard({ post }: { post: PostWithImageAndStats }) {
  const [flipped, flip] = useToggle(false, true);

  return (
    <div
      data-testid="card"
      className="bg-pink dark:bg-blue-dark aspect-h-card text-red-dark dark:text-blue-lighter w-full max-w-xs flex flex-col rounded-xl shadow-2xl overflow-hidden"
      onClick={flip}
    >
      <div
        className="flex flex-col flex-auto overflow-hidden relative bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: flipped ? undefined : `url("${post.image}")`,
        }}
      >
        <h1
          className={clsx(
            "px-4 py-2 text-5xl font-bold",
            !flipped &&
              "absolute bottom-0 left-0 w-full bg-gradient-to-t from-red-darker text-pink-light dark:from-blue-dark dark:text-blue-lighter",
          )}
        >
          {post.title}
        </h1>
        <p
          className={clsx(
            "flex-1 overflow-auto p-4",
            !flipped && "invisible p-0",
          )}
        >
          {post.description}
        </p>
      </div>

      <div className="flex justify-end p-1 px-2 opacity-70">
        <em>Tap to see {flipped ? "picture" : "description"}</em>
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

  function ohNo() {
    onDecisionMade(-1);
  }

  function ayYo() {
    onDecisionMade(1);
  }

  // TODO: Loading skeleton

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 md:gap-8 items-center">
        {isDesktop ? <DesktopCard post={post} /> : <MobileCard post={post} />}

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
