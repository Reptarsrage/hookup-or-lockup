import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { animated, to as interpolate, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { getPosts } from "~/models/post.server";
import Number from "~/components/Number";
import Post from "~/components/Post";
import ConfirmModal from "~/components/ConfirmModal";

const PAGE_SIZE = 10;

/**
 * Remix loader function.
 *
 * @param args - loader arguments
 * @returns - loader data
 */
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  let page = url.searchParams.get("page") || 1;
  if (typeof page == "string") {
    page = parseInt(page, 10);
  }

  const response = await getPosts(page, PAGE_SIZE);
  return json(response);
}

/**
 * Controls card animation.
 *
 * @param gone - if the card is gone
 * @param mx - x movement
 * @param xDir - x direction
 * @param active - if the card is being dragged
 * @param vx - x velocity
 * @param setDecision - setter for the decision state
 * @returns - animation properties
 */
function update(
  gone: boolean,
  mx: number,
  xDir: number,
  active: boolean,
  vx: number,
  setDecision: (val: number) => void
) {
  const x = gone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
  const rot = mx / 100 + (gone ? xDir * 10 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
  const scale = active ? 1.1 : 1; // Active cards lift up a bit

  if (active) {
    // User is dragging the card
    setDecision(Math.max(-1, Math.min(1, mx / (window.innerWidth / 3))));
  } else if (!gone) {
    // User let go of the card, but it isn't flying out yet
    setDecision(0);
  }

  return {
    x,
    rot,
    scale,
    config: {
      friction: 50,
      tension: active ? 800 : gone ? 200 : 500,
    },
  };
}

export default function GamePage() {
  const smasherAndPasser = useFetcher();
  const fetcher = useFetcher();
  let response = useLoaderData<typeof loader>();

  const [posts, setPosts] = useState(response.posts);
  const [page, setPage] = useState(response.page);
  const [total] = useState(response.total);

  const [gone, setGone] = useState(false);
  const [index, setIndex] = useState(0);
  const [decision, setDecision] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Fetch the next page of posts from the server.
   * Updates the fetcher.
   */
  async function fetchMorePosts() {
    if (fetcher.state !== "loading") {
      console.log("FETCHING MORE POSTS");
      const query = `/game?&page=${page + 1}`;
      fetcher.load(query);
    }
  }

  // When the fetcher updates, update the posts
  useEffect(() => {
    if (!fetcher.data || fetcher.state === "loading") {
      return;
    }

    // If we have new data - append it
    if (fetcher.data) {
      const newItems = fetcher.data;
      setPosts((posts) => posts.concat(newItems.posts));
      setPage(newItems.page);
    }
  }, [fetcher.data, fetcher.state]);

  /**
   * Reset the card to the center of the screen.
   */
  function reset() {
    setGone(false);
    setDecision(0);

    api.start(() => ({
      x: 0,
      rot: 0,
      scale: 1.5,
      y: -1000,
      immediate: true,
    }));

    api.start(() => ({
      x: 0,
      y: 0,
      scale: 1,
      rot: -5 + Math.random() * 10,
    }));
  }

  function onConfirmed(confirmed: boolean) {
    setModalOpen(false);

    // reset card
    setTimeout(() => {
      if (confirmed) {
        setIndex(index + 1);
      }
      reset();
    }, 1000);

    // record smash/pass
    if (confirmed) {
      const postId = posts[index].id;
      const action = decision === 1 ? `/smash/${postId}` : `/pass/${postId}`;
      smasherAndPasser.submit(
        {},
        {
          method: "patch",
          action,
        }
      );
    }
  }

  /**
   * When the user chooses smash or pass, animate card, record the decision and fetch more posts.
   */
  function onDecisionMade(decision: 1 | -1) {
    // fetch more posts if needed
    if (index >= posts.length - 2) {
      fetchMorePosts();
    }

    // animate card out of the screen
    setDecision(decision);
    setGone(true);
    api.start(() =>
      update(true, decision * 999, decision, false, 0, setDecision)
    );

    // Show Modal
    setModalOpen(true);
  }

  // Spring to control card
  const [props, api] = useSpring(() => ({
    to: {
      x: 0,
      y: 0,
      scale: 1,
      rot: -5 + Math.random() * 10,
    },
    from: {
      x: 0,
      rot: 0,
      scale: 1.5,
      y: -1000,
    },
  }));

  // gestures to control card
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
      const decisionIsMade = Math.abs(mx) >= window.innerWidth / 3;
      const trigger = vx > 0.5;
      const directionMatchesDecision = mx < 0 === xDir < 0;
      if (!active && trigger && decisionIsMade && directionMatchesDecision) {
        if (xDir < 0) {
          onDecisionMade(-1);
          cancel();
        } else {
          onDecisionMade(1);
          cancel();
        }
      }

      api.start(() => update(gone, mx, xDir, active, vx, setDecision));
    }
  );

  const isEnd = index >= total - 1;
  const isLoading = fetcher.state === "loading" && index >= posts.length;
  const isInteractable = !gone && !isLoading;

  // TODO: show a game end screen
  if (isEnd) {
    return (
      <div className="flex h-full flex-col">
        <div className="m-2 text-center text-lg">Game Over</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ConfirmModal
        open={modalOpen}
        closeModal={onConfirmed}
        decision={decision}
        post={posts[index]}
      />

      <div className="m-2 text-center text-lg">
        Viewing <Number value={index + 1} /> of <Number value={total} />
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        style={{ minHeight: 500 }}
      >
        <animated.div
          className="absolute flex items-center justify-center will-change-transform"
          style={{
            x: props.x,
            y: props.y,
            width: "45vh",
            height: "85vh",
            maxWidth: 300,
            maxHeight: 500,
          }}
        >
          <animated.div
            {...(isInteractable ? bind() : {})}
            style={{
              transform: interpolate(
                [props.rot, props.scale],
                (r, s) => `rotate(${r}deg) scale(${s})`
              ),
              width: "45vh",
              height: "85vh",
              maxWidth: 300,
              maxHeight: 500,
            }}
            className="flex touch-none select-none flex-col gap-2 overflow-hidden rounded-xl bg-pink shadow-lg will-change-transform"
            data-testid="card"
          >
            {isLoading ? (
              <div
                role="status"
                className="absolute top-2/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <svg
                  aria-hidden="true"
                  className="mr-2 h-8 w-8 animate-spin fill-red text-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <Post post={posts[index]} decision={decision} />
            )}
          </animated.div>
        </animated.div>
      </div>

      <div className="flex items-center justify-center gap-8 p-4">
        <button
          className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-none bg-blue-light px-4 py-3 text-lg font-medium uppercase text-blue-dark outline-none transition-opacity duration-300 hover:bg-blue-lighter disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
          disabled={!isInteractable}
          onClick={() => onDecisionMade(-1)}
          data-testid="oh-no"
        >
          <img width="64" height="64" src="/oh-no.svg" alt="Oh No" />
          <span>Oh No!</span>
        </button>

        <button
          className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-none bg-pink px-4 py-3 text-lg font-medium uppercase text-red outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
          disabled={!isInteractable}
          onClick={() => onDecisionMade(1)}
          data-testid="ay-yo"
        >
          <img width="64" height="64" src="/ay-yo.svg" alt="Ay Yo" />
          <span>Ay Yo!</span>
        </button>
      </div>
    </div>
  );
}
