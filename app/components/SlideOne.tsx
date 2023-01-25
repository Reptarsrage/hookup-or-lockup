import Lottie from "react-lottie";

import * as animationData from "../lottie/slide-1.json";

function SlideOne() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <Lottie options={{ animationData, loop: false }} />
      </div>

      <h2 className="mb-8 text-5xl font-semibold">Welcome!</h2>
      <p className="mb-16 text-center">
        Welcome to Hookup or Lockup. The game of guessing; who's in prison or
        who's just dating. Click 'Next' to start the game.
      </p>
    </>
  );
}

export default SlideOne;
