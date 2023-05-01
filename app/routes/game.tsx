import type { HeadersFunction, LoaderArgs } from "@remix-run/node";
import type { V2_ErrorBoundaryComponent } from "@remix-run/server-runtime/dist/routeModules";
import { json } from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { getPosts } from "~/models/post.server";
import ErrorElt from "~/components/Error";
import NotFound from "~/components/NotFound";
import cache from "~/cache";

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
export async function loader({ params }: LoaderArgs) {
  const indexStr = params.idx || "0";
  const index = parseInt(indexStr, 10);
  if (isNaN(index)) {
    throw new Response("Not found", { status: 404 });
  }

  const page = (index % PAGE_SIZE) + 1; // 1-based indexing

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

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
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
  useLoaderData<typeof loader>(); // used in child routes

  // TODO: Add dark mode & switcher

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      <Outlet />
    </div>
  );
}
