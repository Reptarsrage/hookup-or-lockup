import React from "react";
import type { Mock } from "vitest";
import Lottie from "react-lottie";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SlideTwo from "../SlideTwo";

// lottie requires a canvas which is not available in jsdom
vi.mock("react-lottie", () => ({ default: vi.fn() }));

test("renders 'How to Play'", async () => {
  render(<SlideTwo />);
  const welcome = await screen.findByText("How to Play");
  expect(welcome).toBeInTheDocument();
});

test("renders lottie animation", () => {
  const mockLottie = Lottie as unknown as Mock;
  mockLottie.mockReturnValue(React.Fragment);
  render(<SlideTwo />);
  expect(mockLottie).toHaveBeenCalled();
});
