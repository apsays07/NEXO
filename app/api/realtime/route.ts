import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* Global in-memory broadcast manager for real-time SSE stream */
const globalClients = new Set<(data: string) => void>();

export function broadcastRealtimeEvent(event: string, data: any) {
  const payload = JSON.stringify({ event, data });
  const formatted = `data: ${payload}\n\n`;
  globalClients.forEach((send) => {
    try {
      send(formatted);
    } catch {}
  });
}

export async function GET(req: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: string) => {
        try {
          controller.enqueue(new TextEncoder().encode(data));
        } catch {}
      };

      globalClients.add(send);

      // Initial connection ping
      send(`data: ${JSON.stringify({ event: "connected", data: { time: new Date().toISOString() } })}\n\n`);

      // Heartbeat ping every 15 seconds
      const timer = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": keepalive\n\n"));
        } catch {
          clearInterval(timer);
          globalClients.delete(send);
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(timer);
        globalClients.delete(send);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
