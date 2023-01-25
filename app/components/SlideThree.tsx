import Lottie from "react-lottie";

import * as animationData from "../lottie/slide-3.json";

function SlideThree() {
  return (
    <>
      <div className="flex flex-auto items-center justify-center">
        <Lottie
          options={{ animationData: animationData, loop: true }}
          height={400}
        />
      </div>

      <h2 className="mb-8 text-5xl font-semibold">Here We Go!</h2>
      <p className="mb-16 text-center">
        Can you guess who's looking for love or just to pass the time? This game
        is for those who are interested in looking for details.
      </p>
    </>
  );
}

export default SlideThree;
