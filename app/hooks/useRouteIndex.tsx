import { useParams } from "@remix-run/react";

export default function useRouteIndex() {
  const routeParams = useParams();
  const indexStr = routeParams.idx ?? "0";
  return parseInt(indexStr, 10);
}
