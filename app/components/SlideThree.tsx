import Lottie from "lottie-react";

import * as animationData from "../lottie/slide-3.json";

function SlideThree() {
  return (
    <>
      <div className="flex flex-auto items-center justify-center">
        <Lottie animationData={animationData} height={400} loop />
      </div>

      <h2 className="mb-8 text-5xl font-semibold">Here We Go!</h2>
      <p className="mb-16 text-center">
        Can you guess who&apos;s looking for love or just to pass the time? This
        game is for those who are interested in looking for details.
      </p>
    </>
  );
}

export default SlideThree;
