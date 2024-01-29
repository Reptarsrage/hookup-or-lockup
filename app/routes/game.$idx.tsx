import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import cache from "~/cache";
import ErrorElt from "~/components/Error";
import MoonIcon from "~/components/icons/Moon";
import SunIcon from "~/components/icons/Sun";
import NotFound from "~/components/NotFound";
import Number from "~/components/Number";
import { Theme, useTheme } from "~/context/themeProvider";
import useRouteIndex from "~/hooks/useRouteIndex";
import useScore from "~/hooks/useScore";
import { getPosts } from "~/models/post.server";
import type { Page } from "~/models/post.server";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

/**
 * Page size when fetching data
 */
const PAGE_SIZE = 10;

/**
 * Remix loader function.
 *
 * @param args - loader arguments
 * @returns - loader data
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const indexStr = params.idx || "0";
  const index = parseInt(indexStr, 10);
  if (isNaN(index)) {
    throw new Response("Not found", { status: 404 });
  }

  const page = Math.floor(index / PAGE_SIZE) + 1; // 1-based indexing
  if (cache.has(page)) {
    return json(cache.get(page));
  }

  const response = await getPosts(page, PAGE_SIZE);
  cache.set(page, response);
  return json(response, {
    headers: {
      "Cache-Control": "max-age=300, s-maxage=3600",
    },
  });
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.error(errorMessage);
  return <ErrorElt />;
};

export default function GameLayout() {
  const { total } = useLoaderData<typeof loader>() as Page;
  const index = useRouteIndex();
  const [theme, setTheme] = useTheme();

  function toggleTheme() {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  }

  const { numberGuessed, numberCorrect, percentCorrect } = useScore();

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

          {/* Tracker */}
          {numberGuessed > 0 ? (
            <span>
              Score: <Number value={numberCorrect} /> (
              <Number value={percentCorrect} />
              %)
            </span>
          ) : null}

          {/* Counter */}
          {index !== null ? (
            <span>
              <b>
                <Number value={index + 1} />
              </b>
              {" of "}
              <b>
                <Number value={total} />
              </b>
            </span>
          ) : null}
        </header>

        <Outlet />
      </div>
    </div>
  );
}
