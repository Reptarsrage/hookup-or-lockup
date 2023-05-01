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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden md:gap-8">
      {/* Counter */}
      <div className="w-full text-right text-xl text-red-darker dark:text-gray-dark md:text-center">
        <b>
          <Number value={index + 1} />
        </b>{" "}
        {" of "}
        <b>
          <Number value={total} />
        </b>
      </div>

      {/* Profile card (desktop) */}
      <div
        data-testid="card"
        className="flex max-h-[682px] w-full max-w-sm flex-grow flex-col justify-stretch overflow-hidden rounded-xl bg-pink shadow-2xl dark:bg-blue-dark md:aspect-card md:max-w-3xl md:flex-grow-0 md:flex-row"
      >
        {/* Title (Mobile) + Image */}
        <div className="relative flex h-1/2 items-end md:aspect-h-card md:h-full">
          <img
            src={post.image}
            alt={post.title}
            className="absolute left-0 top-0 z-0 h-full w-full object-cover object-top"
          />
          <h1 className="z-10 w-full bg-gradient-to-t from-red-darker px-4 pb-2 text-center text-4xl font-bold text-pink dark:from-black dark:text-blue-lighter md:hidden">
            {post.title}
          </h1>
        </div>

        {/* Description + Title (Desktop) */}
        <div className="flex flex-1 flex-col overflow-hidden md:p-4">
          <h1 className="hidden p-4 text-5xl font-bold text-red-dark dark:text-blue-lighter md:block">
            {post.title}
          </h1>
          {/* TODO: Tags? */}
          <p className="flex-1 overflow-auto p-4 text-sm text-red-dark dark:text-blue-lighter">
            {post.description}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex w-full items-center justify-evenly gap-4 md:gap-8 md:p-4">
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
    </div>
  );
}
