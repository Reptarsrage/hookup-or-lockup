import React from "react";
import type { Mock } from "vitest";
import Lottie from "react-lottie";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SlideOne from "../SlideOne";

// lottie requires a canvas which is not available in jsdom
vi.mock("react-lottie", () => ({ default: vi.fn() }));

test("renders 'Welcome!'", async () => {
  render(<SlideOne />);
  const welcome = await screen.findByText("Welcome!");
  expect(welcome).toBeInTheDocument();
});

test("renders lottie animation", () => {
  const mockLottie = Lottie as unknown as Mock;
  mockLottie.mockReturnValue(React.Fragment);
  render(<SlideOne />);
  expect(mockLottie).toHaveBeenCalled();
});
