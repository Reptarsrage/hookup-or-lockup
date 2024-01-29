import { useFetcher, useNavigate } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { useState } from "react";

import ConfirmModal from "~/components/ConfirmModal";
import Game from "~/components/Game";
import useParentData from "~/hooks/useParentData";
import useRouteIndex from "~/hooks/useRouteIndex";
import useStatsTracker from "~/hooks/useStatsTracker";

type Undecided = 0;
type Decision = -1 | 1;

export default function GamePage() {
  const smasherAndPasser = useFetcher();

  const navigate = useNavigate();

  const { posts } = useParentData();

  const index = useRouteIndex();

  const [decision, setDecision] = useState<Decision | Undecided>(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const { recordStats } = useStatsTracker();
  const [startTime, setStartTime] = useState(new Date().getTime());

  function onDecisionMade(decision: Decision) {
    setDecision(decision);
    setShowConfirm(true);
  }

  async function onConfirmed(confirmed: boolean) {
    setShowConfirm(false);

    if (!confirmed || decision === 0 || index === null) {
      return;
    }

    // record smash/pass
    const postId = posts[index % posts.length].id;
    const action = decision === 1 ? `/smash/${postId}` : `/pass/${postId}`;
    smasherAndPasser.submit(
      {},
      {
        method: "patch",
        action,
      },
    );

    // Update post stats
    post.totalVotes++;
    if (decision === 1) {
      post.smashes++;
    } else {
      post.passes++;
    }

    recordStats({
      post,
      decision,
      timeTaken: new Date().getTime() - startTime,
    });

    setStartTime(new Date().getTime());

    // attempt to give time for the stats to be recorded
    setTimeout(
      () => navigate(`/game/${index}/results?decision=${decision}`),
      100,
    );
  }

  if (index === null) {
    return redirect("/game/0");
  }

  const post = posts[index % posts.length];

  return (
    <>
      <ConfirmModal
        open={showConfirm}
        onConfirmed={onConfirmed}
        decision={decision}
        post={post}
      />

      <Game onDecisionMade={onDecisionMade} post={post} />
    </>
  );
}
