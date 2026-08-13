/* ────────────────────────────────────────────────────────────────
   REAL-TIME CHAT SERVICE ABSTRACTION
   Provides event-driven transport (SSE + WebSocket hub) for NEXO Chat.
   Can be plugged into WebSockets / Socket.IO without changing UI components.
──────────────────────────────────────────────────────────────── */

type ChatEventCallback = (data: any) => void;

class ChatRealtimeService {
  private listeners: Map<string, Set<ChatEventCallback>> = new Map();
  private eventSource: EventSource | null = null;
  private currentMemberId: string | null = null;
  private isConnected: boolean = false;

  public connect(memberId: string) {
    if (typeof window === "undefined") return;
    this.currentMemberId = memberId;

    if (this.eventSource) {
      return;
    }

    try {
      const sseUrl = `/api/realtime?memberId=${encodeURIComponent(memberId)}`;
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.emit("presence:update", { memberId, status: "ONLINE" });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.event && payload?.data) {
            this.emit(payload.event, payload.data);
          }
        } catch {}
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        // EventSource automatically retries connection
      };
    } catch (err) {
      console.warn("Realtime EventSource setup error:", err);
    }
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
  }

  public on(event: string, callback: ChatEventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.off(event, callback);
    };
  }

  public off(event: string, callback: ChatEventCallback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  public emit(event: string, data: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((cb) => cb(data));
    }
  }

  public notifyNewMessage(message: any) {
    this.emit("message:new", message);
  }

  public notifyTyping(conversationId: string, memberId: string, isTyping: boolean) {
    this.emit("message:typing", { conversationId, memberId, isTyping });
  }

  public notifyRead(conversationId: string, memberId: string) {
    this.emit("message:read", { conversationId, memberId });
  }
}

export const chatRealtime = new ChatRealtimeService();
