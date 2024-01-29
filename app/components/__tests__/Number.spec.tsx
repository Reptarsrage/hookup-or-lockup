import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import Number from "../Number";

test("displays localized small number", async () => {
  render(<Number value={12} />);
  const number = await screen.findByText("12");
  expect(number).toBeInTheDocument();
});

test("displays localized large number", async () => {
  render(<Number value={123456789} />);
  const number = await screen.findByText("123,456,789");
  expect(number).toBeInTheDocument();
});

test("displays localized zero", async () => {
  render(<Number value={0} />);
  const number = await screen.findByText("0");
  expect(number).toBeInTheDocument();
});

test("displays NaN as zero", async () => {
  render(<Number value={NaN} />);
  const number = await screen.findByText("0");
  expect(number).toBeInTheDocument();
});

test("does not render null", async () => {
  render(<Number value={null as unknown as number} />);
});
