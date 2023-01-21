import * as React from "react";
import { useSpring, useChain, useSpringRef, animated } from "@react-spring/web";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const DURATION = 2500;

export default function App() {
  const [shown, setShown] = React.useState(false);
  const [width, height] = useWindowSize();

  // Fade to black
  const fadeToBlackRef = useSpringRef();
  const fadeToBlackStyle = useSpring({
    ref: fadeToBlackRef,
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 100,
  });

  // Spring for card shake & grow
  const shakeAndGrowRef = useSpringRef();
  const shakeAndGrowStyle = useSpring({
    ref: shakeAndGrowRef,
    from: { x: 0 },
    x: 1,
    config: { duration: DURATION },
  });

  // Spring for stamp fly-in
  const flyInRef = useSpringRef();
  const flyInStyle = useSpring({
    ref: flyInRef,
    from: {
      opacity: 0,
      y: -1000,
      x: 1000,
    },
    to: { opacity: 1, y: 0, x: 0 },
  });

  // Spring for stamp splat
  const splatRef = useSpringRef();
  const splatStyle = useSpring({
    ref: splatRef,
    from: { x: 0 },
    x: 1,
    onRest: () => setShown(true),
  });

  useChain([fadeToBlackRef, shakeAndGrowRef]);
  useChain([shakeAndGrowRef, flyInRef, splatRef], [0, 0.5, 0.55], DURATION);

  return (
    <animated.div style={fadeToBlackStyle} className="backdrop">
      <Confetti width={width} height={height} run={shown} />

      <animated.div
        className="card"
        style={{
          opacity: shakeAndGrowStyle.x.to({
            range: [0, 0.2, 1],
            output: [0, 0.3, 1],
          }),
          rotate: shakeAndGrowStyle.x.to(
            (r) => Math.sin(r * 18 * Math.PI) * 10
          ),
          scale: shakeAndGrowStyle.x.to({
            range: [0, 0.95, 1],
            output: [0.9, 1.2, 1],
          }),
        }}
      >
        <animated.div
          style={{
            ...flyInStyle,
            scale: splatStyle.x.to({
              range: [0, 0.95, 1],
              output: [0.9, 1.4, 1],
            }),
          }}
        >
          <h1>Hello World!</h1>
        </animated.div>
      </animated.div>
    </animated.div>
  );
}
