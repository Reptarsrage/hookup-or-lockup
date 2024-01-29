import { useParams } from "@remix-run/react";

export default function useRouteIndex(): number | null {
  const routeParams = useParams();
  const indexStr = routeParams.idx;
  if (!indexStr) {
    return null;
  }

  return parseInt(indexStr, 10);
}
