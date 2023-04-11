export default function GameOver() {
  function showUserStats() {
    // TODO: show stats
  }

  function showAllTimeStats() {
    // TODO: show stats
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-blue-lighter md:gap-8 md:p-8">
      <main className="max-w-xs text-center">
        <h1 className="mb-8 text-5xl font-bold uppercase">Game Over</h1>
        <h2 className="mb-4 font-bold">
          You swiped through the entire database of people we have!
        </h2>
        <p>
          See your stats or view the all thime stats and see how you compare.
        </p>
      </main>

      <footer className="flex w-full flex-row justify-center gap-4 md:gap-8">
        <button
          className="rounded-2xl bg-blue-light px-12 py-4 text-white outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
          disabled={false}
          onClick={showUserStats}
          data-testid="stats"
        >
          Your stats
        </button>

        <button
          className="rounded-2xl bg-pink px-12 py-4 text-white outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
          disabled={false}
          onClick={showAllTimeStats}
          data-testid="continue"
        >
          Continue
        </button>
      </footer>
    </div>
  );
}
