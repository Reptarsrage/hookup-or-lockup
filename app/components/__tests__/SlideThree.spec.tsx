import React from "react";
import type { Mock } from "vitest";
import Lottie from "react-lottie";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SlideThree from "../SlideThree";

// lottie requires a canvas which is not available in jsdom
vi.mock("react-lottie", () => ({ default: vi.fn() }));

test("renders 'Here We Go!'", async () => {
  render(<SlideThree />);
  const welcome = await screen.findByText("Here We Go!");
  expect(welcome).toBeInTheDocument();
});

test("renders lottie animation", () => {
  const mockLottie = Lottie as unknown as Mock;
  mockLottie.mockReturnValue(React.Fragment);
  render(<SlideThree />);
  expect(mockLottie).toHaveBeenCalled();
});
