import { useWindowSize } from "@react-hook/window-size";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import Confetti from "react-confetti";

import useParentData from "~/hooks/useParentData";
import useRouteIndex from "~/hooks/useRouteIndex";
import { useSsrCompatible } from "~/hooks/useSsrCompatible";

type Undecided = 0;
type Decision = -1 | 1;

export default function ResultsPage() {
  const [innerWidth, innerHeight] = useSsrCompatible(useWindowSize(), [0, 0]);

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const decisionStr = searchParams.get("decision") ?? "0";
  const decision = parseInt(decisionStr) as Decision | Undecided;

  const { posts } = useParentData();
  const index = useRouteIndex();

  if (decision === 0) {
    return redirect("/game/0");
  }

  if (index === null) {
    return redirect("/game/0");
  }

  const post = posts[index % posts.length];
  const choseLockedUp = decision === -1;
  const isCorrect = choseLockedUp === post.lockedUp;
  const returnUrl = `${location.pathname}${location.search}`;
  const totalVotes = post.totalVotes + 1; // Make sure we add the user's vote :)
  const smashes = post.smashes + (choseLockedUp ? 0 : 1);
  const smashP = Math.ceil((smashes / totalVotes) * 100);
  const passP = 100 - smashP;

  return (
    <>
      <Confetti
        width={innerWidth}
        height={innerHeight}
        run={isCorrect}
        numberOfPieces={100}
      />

      <main className="flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-4 md:p-8">
        <h1 className="md:mb-2 font-sans text-3xl font-bold uppercase text-black">
          Results
        </h1>
        <h3 className="text-2xl font-bold text-red-dark">
          {isCorrect ? "Correct!" : "Incorrect!"}
        </h3>

        <div className="flex w-full my-2 flex-auto md:my-4 justify-center items-center">
          <div
            className="h-48 w-48 rounded-full bg-cover bg-top bg-no-repeat"
            style={{ backgroundImage: `url("${post.image}")` }}
          />
        </div>

        <h3 className="text-2xl font-bold text-red-dark">{post.title}</h3>
        <h3 className="text-2xl text-gray">
          is {post.lockedUp ? " in " : " not in "}
          <b className="uppercase text-blue-dark">Jail</b>
        </h3>
      </main>

      <div className="flex w-full items-center justify-center rounded-2xl bg-gray-light overflow-hidden">
        {passP > 0 ? (
          <div
            className="bg-blue-light w-full h-10 flex items-center justify-start px-4"
            style={{
              width: `${passP}%`,
            }}
          >
            {smashP <= passP ? (
              <span className="text-white whitespace-nowrap overflow-hidden">
                {passP}% Chose to lockup
              </span>
            ) : null}
          </div>
        ) : null}

        {smashP > 0 ? (
          <div
            className="bg-pink w-full h-10 flex justify-end items-center px-4"
            style={{
              width: `${smashP}%`,
            }}
          >
            {smashP > passP ? (
              <span className="text-white whitespace-nowrap overflow-hidden">
                {smashP}% Chose to hookup
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className="flex w-full flex-row justify-between gap-4 md:gap-8">
        <Link
          className="flex-1 rounded-2xl bg-blue-light p-4 text-center text-white outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
          to={`/user-stats?${new URLSearchParams({
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
    </>
  );
}
