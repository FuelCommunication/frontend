export interface Message {
    id: string;
    username: string;
    text: string;
    ts: number;
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    parts: { type: string; text: string }[];
    timestamp: number;
}

export type ClientMessage =
    | { join: { username: string } }
    | { chat: { message: string } };