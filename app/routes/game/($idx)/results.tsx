import Confetti from "react-confetti";
import { useSsrCompatible } from "~/hooks/useSsrCompatible";
import { useWindowSize } from "@react-hook/window-size";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import useParentData from "~/hooks/useParentData";
import useRouteIndex from "~/hooks/useRouteIndex";
import useStatsTracker from "~/hooks/useStatsTracker";
import Number from "~/components/Number";
import { useMemo } from "react";

type Undecided = 0;
type Decision = -1 | 1;

export default function ResultsPage() {
  const [innerWidth, innerHeight] = useSsrCompatible(useWindowSize(), [0, 0]);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const decisionStr = searchParams.get("decision") ?? "0";
  const decision = parseInt(decisionStr) as Decision | Undecided;

  const parentData = useParentData();
  const index = useRouteIndex();

  const { stats } = useStatsTracker();
  const percentCorrect = useMemo(
    () =>
      Math.ceil(
        (stats.filter((stat) => (stat.decision === -1) === stat.post.lockedUp)
          .length /
          stats.length) *
          100.0
      ),
    [stats]
  );

  if (decision === 0) {
    return redirect("/game");
  }

  const post = parentData.posts[index];
  const choseLockedUp = decision === -1;
  const isCorrect = choseLockedUp === post.lockedUp;
  const returnUrl = `${location.pathname}${location.search}`;

  return (
    <>
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
            So far you got{" "}
            <b>
              <Number value={percentCorrect} />% correct!
            </b>
          </span>
        </section>

        <footer className="flex w-full flex-row justify-between gap-4 md:gap-8">
          <Link
            className="flex-1 rounded-2xl bg-blue-light p-4 text-center text-white outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
            to={`/game/user-stats?${new URLSearchParams({
              returnUrl,
            }).toString()}`}
          >
            Your stats
          </Link>

          <Link
            className="flex-1 rounded-2xl bg-pink p-4 text-center text-white outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
            to={`/game/${index + 1}`}
          >
            Continue
          </Link>
        </footer>
      </div>
    </>
  );
}