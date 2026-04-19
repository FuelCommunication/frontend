export interface ServerMessagePayload {
    message_id: string;
    user_id: string;
    username: string;
    text: string;
    ts: number;
}

export interface ServerMessageEvent extends ServerMessagePayload {
    type: "message";
}

export interface ServerHistoryEvent {
    type: "history";
    messages: ServerMessagePayload[];
}

export interface ServerEditedEvent {
    type: "edited";
    message_id: string;
    text: string;
    ts: number;
}

export interface ServerDeletedEvent {
    type: "deleted";
    message_id: string;
}

export interface ServerTypingEvent {
    type: "typing";
    user_id: string;
    username: string;
}

export interface ServerErrorEvent {
    type: "error";
    text: string;
}

export interface ServerChannelDeletedEvent {
    type: "channel_deleted";
}

export interface ServerKickedEvent {
    type: "kicked";
    user_id: string;
}

export type ServerEvent =
    | ServerMessageEvent
    | ServerHistoryEvent
    | ServerEditedEvent
    | ServerDeletedEvent
    | ServerTypingEvent
    | ServerErrorEvent
    | ServerChannelDeletedEvent
    | ServerKickedEvent;

export interface ChatMessage {
    id: string;
    user_id: string;
    role: "user" | "assistant";
    parts: { type: string; text: string }[];
    createdAt?: Date;
    avatar?: { src?: string; alt?: string; text?: string; icon?: string };
}
