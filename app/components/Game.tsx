import { useState } from "react";

import type { PostWithImageAndStats } from "~/models/post.server";
import Number from "~/components/Number";
import { AyYo, OhNo } from "~/components/icons";

type Decision = -1 | 1;

type GameProps = {
  post: PostWithImageAndStats;
  index: number;
  total: number;
  onDecisionMade: (decision: Decision) => void;
};

export default function Game({
  onDecisionMade,
  post,
  index,
  total,
}: GameProps) {
  const [interactable] = useState(true);

  function ohNo() {
    onDecisionMade(-1);
  }

  function ayYo() {
    onDecisionMade(1);
  }

  // TODO: Loading skeleton

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden p-4 md:gap-8 md:p-8">
      {/* Counter */}
      <span className="text-xl text-red-darker dark:text-gray-dark">
        <b>
          <Number value={index + 1} />
        </b>{" "}
        {" of "}
        <b>
          <Number value={total} />
        </b>
      </span>

      <div className="flex items-center justify-center ">
        {/* Profile card (desktop) */}
        <div
          data-testid="card"
          className="flex aspect-h-video max-w-sm flex-col justify-stretch overflow-hidden rounded-xl bg-pink shadow-lg dark:bg-blue-dark md:aspect-video md:max-w-4xl md:flex-row"
        >
          <div className="relative flex h-1/2 items-end md:aspect-h-video md:h-full">
            <img
              src={post.image}
              alt={post.title}
              className="absolute left-0 top-0 z-0 h-full w-full object-cover object-top"
            />
            <h1 className="z-10 w-full bg-gradient-to-t from-red-darker p-4 text-center text-4xl font-bold text-pink dark:from-black dark:text-blue-lighter md:hidden">
              {post.title}
            </h1>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden p-2 md:p-8">
            <h1 className="mb-4 hidden text-4xl font-bold text-red-dark dark:text-blue-lighter md:block">
              {post.title}
            </h1>
            {/* TODO: Tags? */}
            <p className="flex-1 overflow-auto text-sm text-red-dark dark:text-blue-lighter">
              {post.description}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-4 p-4 md:gap-8">
        <button
          className="rounded-full bg-blue-light px-6 py-6 text-3xl font-semibold text-blue-dark outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm md:px-8 md:py-4"
          disabled={!interactable}
          onClick={ohNo}
          data-testid="oh-no"
        >
          <OhNo className="inline h-12 w-12 md:h-8 md:w-8" />
          <span className="ml-4 hidden md:inline">Lockup</span>
        </button>

        <span className="text-3xl font-bold uppercase italic text-red-darker dark:text-gray-dark md:text-4xl">
          Or
        </span>

        <button
          className="rounded-full bg-pink px-6 py-6 text-3xl font-semibold text-red-dark outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm md:px-8 md:py-4"
          disabled={!interactable}
          onClick={ayYo}
          data-testid="ay-yo"
        >
          <AyYo className="inline h-12 w-12 md:h-8 md:w-8" />
          <span className="ml-4 hidden md:inline">Hookup</span>
        </button>
      </div>
    </div>
  );
}
