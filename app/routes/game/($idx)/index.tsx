import { useFetcher, useNavigate } from "@remix-run/react";
import { useState } from "react";

import ConfirmModal from "~/components/ConfirmModal";
import Game from "~/components/Game";
import useParentData from "~/hooks/useParentData";
import useRouteIndex from "~/hooks/useRouteIndex";

type Undecided = 0;
type Decision = -1 | 1;

export default function GamePage() {
  const smasherAndPasser = useFetcher();

  const navigate = useNavigate();

  const { total, posts } = useParentData();

  const index = useRouteIndex();
  const post = posts[index];

  const [decision, setDecision] = useState<Decision | Undecided>(0);
  const [showConfirm, setShowConfirm] = useState(false);

  function onDecisionMade(decision: Decision) {
    setDecision(decision);
    setShowConfirm(true);
  }

  function onConfirmed(confirmed: boolean) {
    setShowConfirm(false);

    if (!confirmed) {
      return;
    }

    // record smash/pass
    const postId = posts[index].id;
    const action = decision === 1 ? `/smash/${postId}` : `/pass/${postId}`;
    smasherAndPasser.submit(
      {},
      {
        method: "patch",
        action,
      }
    );

    // Update post stats
    post.totalVotes++;
    if (decision === 1) {
      post.smashes++;
    } else {
      post.passes++;
    }

    navigate(`/game/${index}/results?decision=${decision}`);
  }

  return (
    <>
      <ConfirmModal
        open={showConfirm}
        onConfirmed={onConfirmed}
        decision={decision}
        post={post}
      />

      <Game
        index={index}
        total={total}
        onDecisionMade={onDecisionMade}
        post={post}
      />
    </>
  );
}
