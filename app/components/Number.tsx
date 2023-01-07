type NumberProps = {
  value: number;
};

function Number({ value }: NumberProps) {
  if (typeof value !== "number") {
    return null;
  }

  return <span>{value.toLocaleString()}</span>;
}

export default Number;
