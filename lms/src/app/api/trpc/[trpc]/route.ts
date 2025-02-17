import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@server/routers";
import { createContext } from "@server/context";
import { renderTrpcPanel } from "trpc-panel";
import { NextResponse } from "next/server";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });
};

export function GET() {
  const panelHtml = renderTrpcPanel(appRouter, { url: "/api/trpc" });
  return new NextResponse(panelHtml, { headers: { "Content-Type": "text/html" } });
}

export { handler as POST };
