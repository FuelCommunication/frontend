export interface UseWsOptions {
  immediate?: boolean;
  autoReconnect?: boolean | {
    retries?: number;
    delay?: number;
    onFailed?: () => void;
  };
  heartbeat?: boolean | {
    message?: string;
    interval?: number;
    pongTimeout?: number;
  };
  onMessage?: (data: MessageEvent) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

type WsStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

export function useWs(url: MaybeRef<string>, options: UseWsOptions = {}) {
  const {
    immediate = true,
    autoReconnect = false,
    heartbeat = false,
    onMessage,
    onOpen,
    onClose,
    onError,
  } = options;

  const status = ref<WsStatus>("CLOSED");
  const data = ref<string | null>(null);

  let ws: WebSocket | null = null;
  let retryCount = 0;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let pongTimer: ReturnType<typeof setTimeout> | null = null;
  let explicitClose = false;

  const reconnectOpts = typeof autoReconnect === "object" ? autoReconnect : {};
  const maxRetries = reconnectOpts.retries ?? 10;
  const retryDelay = reconnectOpts.delay ?? 1500;

  const heartbeatOpts = typeof heartbeat === "object" ? heartbeat : {};
  const hbMessage = heartbeatOpts.message ?? "ping";
  const hbInterval = heartbeatOpts.interval ?? 30000;
  const hbPongTimeout = heartbeatOpts.pongTimeout ?? 10000;

  function startHeartbeat() {
    stopHeartbeat();
    if (!heartbeat) return;

    heartbeatTimer = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(hbMessage);
        pongTimer = setTimeout(() => {
          ws?.close();
        }, hbPongTimeout);
      }
    }, hbInterval);
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (pongTimer) {
      clearTimeout(pongTimer);
      pongTimer = null;
    }
  }

  function open() {
    close();
    explicitClose = false;

    const resolvedUrl = toValue(url);
    ws = new WebSocket(resolvedUrl);
    status.value = "CONNECTING";

    ws.onopen = (event) => {
      status.value = "OPEN";
      retryCount = 0;
      startHeartbeat();
      onOpen?.(event);
    };

    ws.onmessage = (event) => {
      if (pongTimer) {
        clearTimeout(pongTimer);
        pongTimer = null;
      }
      data.value = event.data;
      onMessage?.(event);
    };

    ws.onclose = (event) => {
      status.value = "CLOSED";
      stopHeartbeat();
      onClose?.(event);

      if (!explicitClose && autoReconnect) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(open, retryDelay);
        } else {
          reconnectOpts.onFailed?.();
        }
      }
    };

    ws.onerror = (event) => {
      onError?.(event);
    };
  }

  function close() {
    explicitClose = true;
    stopHeartbeat();
    if (ws) {
      status.value = "CLOSING";
      ws.close();
      ws = null;
    }
  }

  function send(payload: string | ArrayBufferLike | Blob) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(payload);
      return true;
    }
    return false;
  }

  if (immediate) {
    open();
  }

  if (import.meta.client) {
    onBeforeUnmount(close);
  }

  return { status: readonly(status), data: readonly(data), open, close, send };
}
