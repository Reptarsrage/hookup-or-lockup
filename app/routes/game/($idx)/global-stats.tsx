import { Link, useSearchParams } from "@remix-run/react";
import Number from "~/components/Number";

// TODO: Implement this page
export default function GlobalStatsPage() {
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/game";

  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-4 md:gap-8">
      <main className="flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-lg md:max-w-xl md:p-8">
        <h1 className="mb-2 font-sans text-3xl font-bold uppercase text-black">
          Your Statistics
        </h1>

        <h3 className="mb-4 text-xl text-gray">So far you guessed...</h3>

        <div className="flex w-full flex-col gap-8 p-4 md:flex-row md:justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-blue-light">
              <span className="text-[48px] font-bold text-blue-dark">
                <Number value={16} />
              </span>
            </div>
            <h5 className="text-2xl font-bold text-blue-dark">Lockup</h5>
            <p className="text-sm text-gray">are in jail</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gray-light">
              <span className="text-[48px] font-bold text-black">
                <Number value={50} />%
              </span>
            </div>
            <h5 className="text-2xl font-bold text-black">Correct</h5>
            <p className="text-sm text-gray">guessed correctly</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-pink-light">
              <span className="text-[48px] font-bold text-red-dark">
                <Number value={16} />
              </span>
            </div>
            <h5 className="text-2xl font-bold text-red-dark">Hookup</h5>
            <p className="text-sm text-gray">are on dating apps</p>
          </div>
        </div>

        <hr className="my-4 w-full text-gray-light" />

        <div className="flex w-full justify-evenly p-4">
          <p className="text-xl text-gray">
            On average you take <b className="text-black">5 minutes</b> to guess
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
    </div>
  );
}
