import { Link } from "@remix-run/react";

export default function GameOverPage() {
  return (
    <>
      <main className="mb-16 max-w-xs text-center text-blue-lighter">
        <h1 className="mb-8 text-5xl font-bold uppercase">Game Over</h1>
        <h2 className="mb-4 font-bold">
          You swiped through the entire database of people we have!
        </h2>
        <p>
          See your stats or view the all thime stats and see how you compare.
        </p>
      </main>

      <footer className="flex w-full flex-row justify-center gap-4 md:gap-8">
        <Link
          className="rounded-2xl bg-blue-light px-12 py-4 text-white outline-none transition-opacity duration-300 hover:bg-blue-lighter"
          to="/game/user-stats?returnUrl=/game/game-over"
        >
          Your stats
        </Link>

        <Link
          className="rounded-2xl bg-pink px-12 py-4 text-white outline-none transition-opacity duration-300 hover:bg-pink-light"
          to="/game/global-stats?returnUrl=/game/game-over"
        >
          Global Stats
        </Link>
      </footer>
    </>
  );
}
