import type { CreateRoomResponse, ListRoomsResponse, Room } from "~/interfaces/calls.interface";

export const useCallsStore = defineStore("calls", () => {
    const { apiFetch } = useApi();

    async function listRooms(offset = 0, limit = 50): Promise<ListRoomsResponse> {
        return apiFetch<ListRoomsResponse>(`/rooms?offset=${offset}&limit=${limit}`);
    }

    async function createRoom(): Promise<string> {
        const res = await apiFetch<CreateRoomResponse>("/rooms", { method: "POST" });
        return res.id;
    }

    async function getRoom(roomId: string): Promise<Room> {
        return apiFetch<Room>(`/rooms/${roomId}`);
    }

    async function deleteRoom(roomId: string): Promise<void> {
        await apiFetch(`/rooms/${roomId}`, { method: "DELETE" });
    }

    return { listRooms, createRoom, getRoom, deleteRoom };
});
