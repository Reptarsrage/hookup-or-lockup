import { Link, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import Number from "~/components/Number";
import useStatsTracker from "~/hooks/useStatsTracker";

export default function UserStatsPage() {
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/game";

  const { stats } = useStatsTracker();

  const { lockups, hookups, averageTimeTaken, percentCorrect } = useMemo(
    () => ({
      lockups: stats.filter((stat) => stat.decision === -1).length,
      hookups: stats.filter((stat) => stat.decision === 1).length,
      percentCorrect: Math.ceil(
        (stats.filter((stat) => (stat.decision === -1) === stat.post.lockedUp)
          .length /
          stats.length) *
          100.0,
      ),
      averageTimeTaken:
        stats.reduce((acc, stat) => acc + stat.timeTaken, 0) /
        stats.length /
        1000.0,
    }),
    [stats],
  );

  return (
    <>
      <main className="flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-4 md:p-8">
        <h1 className="mb-2 font-sans text-3xl font-bold uppercase text-black">
          Your Statistics
        </h1>

        <h3 className="mb-4 text-xl text-gray">So far you guessed...</h3>

        <div className="flex w-full flex-col gap-8 p-4 md:flex-row md:justify-between">
          <div className="flex md:flex-col items-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-blue-light">
              <span className="text-[48px] font-bold text-blue-dark">
                <Number value={lockups} />
              </span>
            </div>
            <div className="pl-4 md:pl-0 md:text-center">
              <h5 className="text-2xl font-bold text-blue-dark">Lockup</h5>
              <p className="text-sm text-gray">are in jail</p>
            </div>
          </div>

          <div className="flex md:flex-col items-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gray-light">
              <span className="text-[48px] font-bold text-black">
                <Number value={percentCorrect} />%
              </span>
            </div>
            <div className="pl-4 md:pl-0 md:text-center">
              <h5 className="text-2xl font-bold text-black">Correct</h5>
              <p className="text-sm text-gray">guessed correctly</p>
            </div>
          </div>

          <div className="flex md:flex-col items-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-pink-light">
              <span className="text-[48px] font-bold text-red-dark">
                <Number value={hookups} />
              </span>
            </div>
            <div className="pl-4 md:pl-0 md:text-center">
              <h5 className="text-2xl font-bold text-red-dark">Hookup</h5>
              <p className="text-sm text-gray">are on dating apps</p>
            </div>
          </div>
        </div>

        <hr className="my-4 w-full text-gray-light" />

        <div className="flex w-full justify-evenly p-4">
          <p className="text-xl text-gray">
            On average you take{" "}
            <b className="text-black">
              <Number value={averageTimeTaken} /> seconds
            </b>{" "}
            to guess
          </p>
        </div>
      </main>

      <footer className="flex w-full flex-row justify-between gap-4 md:gap-8">
        <Link
          className="flex-1 rounded-2xl bg-pink p-4 text-center text-white outline-none transition-opacity duration-300 hover:bg-pink-light"
          to={returnUrl}
        >
          Continue
        </Link>
      </footer>
    </>
  );
}
