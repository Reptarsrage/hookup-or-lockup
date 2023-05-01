import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import useTheme from "./hooks/useTheme";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Poppins:400,500&display=swap",
    },
  ];
};

export const meta: V2_MetaFunction = () => [
  { charset: "utf-8" },
  { title: "Hookup or Lockup" },
  {
    name: "viewport",
    content: "width=device-width,initial-scale=1",
  },
];

export default function App() {
  useTheme();

  return (
    <html lang="en" className="dark h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-red-dark font-sans text-pink dark:bg-black dark:text-blue-lighter">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
