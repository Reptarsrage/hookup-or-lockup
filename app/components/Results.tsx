import Confetti from "react-confetti";
import type { PostWithImageAndStats } from "~/models/post.server";
import { useSsrCompatible } from "~/hooks/useSsrCompatible";
import { useWindowSize } from "@react-hook/window-size";

type ResultsProps = {
  decision: number;
  post: PostWithImageAndStats;
  onGoNext: () => void;
};

function Results({ onGoNext: closeResults, post, decision }: ResultsProps) {
  const [innerWidth, innerHeight] = useSsrCompatible(useWindowSize(), [0, 0]);
  const choseLockedUp = decision === -1;
  const isCorrect = choseLockedUp === post.lockedUp;

  function close() {
    closeResults();
  }

  function showStats() {
    // TODO: show stats
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 md:p-8">
      <Confetti
        width={innerWidth}
        height={innerHeight}
        run={isCorrect}
        numberOfPieces={100}
      />

      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 md:gap-8">
        <main className="flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-lg md:max-w-xl md:p-8">
          <h1 className="mb-2 font-sans text-3xl font-bold uppercase text-black">
            Results
          </h1>
          <h3 className="text-2xl font-bold text-red-dark">
            {isCorrect ? "Correct!" : "Incorrect!"}
          </h3>

          <div className="my-2 aspect-square max-w-xs overflow-hidden rounded-xl md:my-4">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover object-top"
            />
          </div>

          <h3 className="text-2xl font-bold text-red-dark">{post.title}</h3>
          <h3 className="text-2xl text-gray">
            is {post.lockedUp ? " not in " : " in "}
            <b className="uppercase text-blue-dark">Jail</b>
          </h3>
        </main>

        <section className="flex w-full items-center justify-center rounded-2xl bg-gray-light p-4">
          <span className="text-gray-dark">
            So far you got <b>56% correct!</b>
          </span>
        </section>

        <footer className="flex w-full flex-row justify-between gap-4 md:gap-8">
          <button
            className="flex-1 rounded-2xl bg-blue-light p-4 text-white outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
            disabled={false}
            onClick={showStats}
            data-testid="stats"
          >
            Your stats
          </button>

          <button
            className="flex-1 rounded-2xl bg-pink p-4 text-white outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
            disabled={false}
            onClick={close}
            data-testid="continue"
          >
            Continue
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Results;
