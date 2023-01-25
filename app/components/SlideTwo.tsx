import Lottie from "react-lottie";

import * as animationData from "../lottie/slide-2.json";

function SlideTwo() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <Lottie options={{ animationData: animationData, loop: true }} />
      </div>

      <h2 className="mb-8 text-5xl font-semibold">How to Play</h2>
      <p className="mb-16 text-center">
        Just like most dating apps, you'll be shown a profile BUT here you have
        to determine... could they be incarcerated? Look for details in the
        photo(s) and in their bio. Make your best guess and see how well you do!
      </p>
    </>
  );
}

export default SlideTwo;
