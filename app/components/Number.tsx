import clsx from "clsx";
import { forwardRef } from "react";

interface NumberProps {
  value: number;
}

const Number = forwardRef<
  HTMLSpanElement,
  NumberProps & React.HTMLAttributes<HTMLSpanElement>
>(function Number({ value, className, ...passThroughProps }, ref) {
  if (typeof value !== "number") {
    return null;
  }

  if (isNaN(value)) {
    value = 0;
  }

  return (
    <span ref={ref} className={clsx(className)} {...passThroughProps}>
      {value.toLocaleString()}
    </span>
  );
});

export default Number;
