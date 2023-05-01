import {
  useTransition,
  animated,
  useSpringRef,
  useSprings,
} from "@react-spring/web";
import type { HeadersFunction } from "@remix-run/server-runtime";
import type { V2_ErrorBoundaryComponent } from "@remix-run/server-runtime/dist/routeModules";

import { useEffect, useState } from "react";
import clsx from "clsx";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react";

import SlideOne from "../components/SlideOne";
import SlideTwo from "../components/SlideTwo";
import SlideThree from "../components/SlideThree";
import NotFound from "~/components/NotFound";
import ErrorElt from "~/components/Error";

const slides = [SlideOne, SlideTwo, SlideThree];

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

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

export default function Index() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [disabled, setDisabled] = useState(false);

  // transition to control the slides
  const transRef = useSpringRef();
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    initial: { transform: "translate3d(0%,0,0)" },
    from: { transform: "translate3d(100%,0,0)" },
    enter: { transform: "translate3d(0%,0,0)" },
    leave: { transform: "translate3d(-100%,0,0)" },
  });

  // Springs to control pagination indicators
  const [paginationIndicators, paginationApi] = useSprings(
    slides.length,
    (i) => ({
      width: i === index ? 24 : 8,
    })
  );

  /**
   * On click handler for the "Next" button.
   */
  function handleClick() {
    // If the user is on the last slide, navigate to the game
    if (index + 1 >= slides.length) {
      setDisabled(true);
      navigate("/game");
      return;
    }

    // Otherwise, go to the next slide
    setDisabled(true);
    setIndex((index) => index + 1);
    setTimeout(() => setDisabled(false), 750);
  }

  // When the index changes, update the slide and pagination indicators
  useEffect(() => {
    transRef.start();
    paginationApi.start((i) => {
      return {
        width: i === index ? 24 : 8,
      };
    });
  }, [index, transRef, paginationApi]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex h-screen w-screen flex-col rounded-xl bg-blue-light px-8 py-16 shadow-xl md:h-[800px] md:w-[600px]">
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {transitions((style, i) => {
            const Slide = slides[i];
            return (
              <animated.div
                style={style}
                className="absolute flex h-full w-full flex-col items-center"
              >
                <Slide />
              </animated.div>
            );
          })}
        </div>

        <button
          disabled={disabled}
          onClick={handleClick}
          data-testid="next"
          className="m-auto inline-block cursor-pointer rounded-xl border-none bg-pink px-8 py-3 text-lg font-medium text-white outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
        >
          {index === slides.length - 1 ? "Get Started" : "Next"}
        </button>

        <div className="m-auto flex gap-0.5 p-2">
          {paginationIndicators.map((style, i) => (
            <animated.div
              key={i}
              className={clsx(
                "h-2 w-2 rounded-full shadow-sm",
                i === index ? "bg-pink" : "bg-white opacity-20"
              )}
              style={style}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
