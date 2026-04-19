export interface Room {
    id: string;
    created_by: string;
    peers: string[];
    max_peers: number;
}

export interface RoomSummary {
    id: string;
    created_by: string;
    peer_count: number;
    max_peers: number;
}

export interface ListRoomsResponse {
    rooms: RoomSummary[];
    total: number;
}

export interface CreateRoomResponse {
    id: string;
}

// ----- Signaling protocol (matches service-calls/src/signal.rs) -----

export type ClientSignal =
    | { type: "offer"; to: string; sdp: string }
    | { type: "answer"; to: string; sdp: string }
    | { type: "ice_candidate"; to: string; candidate: string };

export type ServerSignal =
    | { type: "joined"; user_id: string; peers: string[] }
    | { type: "user_joined"; user_id: string }
    | { type: "user_left"; user_id: string }
    | { type: "offer"; from: string; sdp: string }
    | { type: "answer"; from: string; sdp: string }
    | { type: "ice_candidate"; from: string; candidate: string }
    | { type: "error"; message: string };

export interface RemotePeer {
    user_id: string;
    stream: MediaStream | null;
    connectionState: RTCPeerConnectionState;
}
