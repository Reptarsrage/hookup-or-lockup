import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <img
        className="m-4 max-w-xl sm:w-full"
        src="/logo.png"
        alt="hookup or lockup"
      />
      <h1 className="mb-4 text-xl font-bold">TODO</h1>
      <p className="mb-2">
        &#123; A temporary placeholder for the tutorial welcome screen &#125;
      </p>

      <Link
        to="/game"
        className="flex items-center justify-center rounded-md bg-pink px-4 py-3 font-bold uppercase text-black hover:bg-pink-light"
      >
        Continue
      </Link>
    </main>
  );
}
