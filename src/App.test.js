import { render, screen, within } from "@testing-library/react";
import App from "./App";

beforeAll(() => {
  class MockIntersectionObserver {
    constructor(callback) { this.callback = callback; }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }

  window.IntersectionObserver = MockIntersectionObserver;
  global.IntersectionObserver = MockIntersectionObserver;

  window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    media: "",
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  }));

  HTMLCanvasElement.prototype.getContext = () => null;
  Element.prototype.scrollIntoView = () => {};
});

test("renders the hero heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: /mohammad umar/i })).toBeInTheDocument();
});

test("renders the primary navigation links", () => {
  render(<App />);
  const nav = screen.getByRole("navigation", { name: /main navigation/i });
  expect(within(nav).getByRole("link", { name: "Work" })).toBeInTheDocument();
  expect(within(nav).getByRole("link", { name: "Contact" })).toBeInTheDocument();
});

test("shows the contact form with a send button", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: /send a message/i })).toBeInTheDocument();
});
