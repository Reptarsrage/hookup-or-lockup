import { Link, useNavigate } from "@remix-run/react";
import { useContext } from "react";
import invariant from "tiny-invariant";

import MoonIcon from "~/components/icons/Moon";
import SunIcon from "~/components/icons/Sun";
import { StatsContext } from "~/context/statsContext";
import { Theme, useTheme } from "~/context/themeProvider";

export default function GameOverPage() {
  const navigate = useNavigate();
  const ctx = useContext(StatsContext);
  const [theme, setTheme] = useTheme();

  function toggleTheme() {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  }

  invariant(ctx, "stats context uninitialized");
  const { clearStats } = ctx;

  function startOver() {
    clearStats();
    navigate("/game/0");
  }

  return (
    <div className="flex flex-auto flex-col items-center justify-center max-h-full overflow-hidden p-4 md:p-8">
      <div className="flex flex-auto flex-col items-center w-full max-w-3xl gap-4 md:gap-8">
        <header className="flex w-full justify-between text-xl text-pink-light dark:text-blue-lighter md:text-center">
          {/* Theme toggle */}
          <button onClick={toggleTheme}>
            {theme === Theme.DARK ? (
              <MoonIcon className="inline h-8 w-8" />
            ) : (
              <SunIcon className="inline h-8 w-8" />
            )}
          </button>
        </header>

        <main className="flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-4 md:p-8">
          <h1 className="mb-2 font-sans text-3xl font-bold uppercase text-black">
            Game Over
          </h1>

          <h3 className="mb-4 text-xl text-gray">
            You swiped through the entire database of people we have!
          </h3>

          <h3 className="mb-4 text-xl text-gray">
            Check out your stats or start over.
          </h3>
        </main>

        <footer className="flex w-full flex-row justify-center gap-4 md:gap-8">
          <Link
            className="rounded-2xl bg-blue-light px-12 py-4 text-white outline-none transition-opacity duration-300 hover:bg-blue-lighter"
            to="/user-stats?returnUrl=/game-over"
          >
            Your stats
          </Link>

          <button
            className="rounded-2xl bg-pink px-12 py-4 text-white outline-none transition-opacity duration-300 hover:bg-pink-light"
            onClick={startOver}
          >
            Start Over
          </button>
        </footer>
      </div>
    </div>
  );
}
