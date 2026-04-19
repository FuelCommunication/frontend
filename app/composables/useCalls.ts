import type { ClientSignal, RemotePeer, ServerSignal } from "~/interfaces/calls.interface";

const ICE_SERVERS: RTCIceServer[] = [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

interface UseCallsOptions {
    roomId: string;
    onError?: (message: string) => void;
}

export function useCalls({ roomId, onError }: UseCallsOptions) {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const localStream = ref<MediaStream | null>(null);
    const remotePeers = ref<Map<string, RemotePeer>>(new Map());
    const selfId = ref<string | null>(null);
    const isMicOn = ref(true);
    const isCamOn = ref(true);
    const isConnecting = ref(false);

    const peerConnections = new Map<string, RTCPeerConnection>();
    const pendingCandidates = new Map<string, RTCIceCandidateInit[]>();
    let ws: WebSocket | null = null;
    let explicitClose = false;

    function send(msg: ClientSignal) {
        if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
    }

    function setRemote(user_id: string, patch: Partial<RemotePeer>) {
        const next = new Map(remotePeers.value);
        const existing = next.get(user_id) ?? {
            user_id,
            stream: null,
            connectionState: "new" as RTCPeerConnectionState,
        };
        next.set(user_id, { ...existing, ...patch });
        remotePeers.value = next;
    }

    function removeRemote(user_id: string) {
        const next = new Map(remotePeers.value);
        next.delete(user_id);
        remotePeers.value = next;
    }

    function createPeerConnection(peerId: string): RTCPeerConnection {
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        if (localStream.value) {
            for (const track of localStream.value.getTracks()) {
                pc.addTrack(track, localStream.value);
            }
        }

        pc.ontrack = (ev) => {
            const [stream] = ev.streams;
            if (stream) setRemote(peerId, { stream });
        };

        pc.onicecandidate = (ev) => {
            if (ev.candidate) {
                send({ type: "ice_candidate", to: peerId, candidate: JSON.stringify(ev.candidate.toJSON()) });
            }
        };

        pc.onconnectionstatechange = () => {
            setRemote(peerId, { connectionState: pc.connectionState });
            if (pc.connectionState === "failed" || pc.connectionState === "closed") {
                cleanupPeer(peerId);
            }
        };

        peerConnections.set(peerId, pc);
        return pc;
    }

    function cleanupPeer(peerId: string) {
        const pc = peerConnections.get(peerId);
        if (pc) {
            pc.ontrack = null;
            pc.onicecandidate = null;
            pc.onconnectionstatechange = null;
            pc.close();
            peerConnections.delete(peerId);
        }
        pendingCandidates.delete(peerId);
        removeRemote(peerId);
    }

    async function makeOffer(peerId: string) {
        const pc = createPeerConnection(peerId);
        setRemote(peerId, {});
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        send({ type: "offer", to: peerId, sdp: offer.sdp ?? "" });
    }

    async function handleOffer(from: string, sdp: string) {
        let pc = peerConnections.get(from);
        if (!pc) pc = createPeerConnection(from);
        setRemote(from, {});

        await pc.setRemoteDescription({ type: "offer", sdp });

        const queued = pendingCandidates.get(from);
        if (queued) {
            for (const c of queued) await pc.addIceCandidate(c).catch(() => {});
            pendingCandidates.delete(from);
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        send({ type: "answer", to: from, sdp: answer.sdp ?? "" });
    }

    async function handleAnswer(from: string, sdp: string) {
        const pc = peerConnections.get(from);
        if (!pc) return;
        await pc.setRemoteDescription({ type: "answer", sdp });

        const queued = pendingCandidates.get(from);
        if (queued) {
            for (const c of queued) await pc.addIceCandidate(c).catch(() => {});
            pendingCandidates.delete(from);
        }
    }

    async function handleCandidate(from: string, candidate: string) {
        let parsed: RTCIceCandidateInit;
        try {
            parsed = JSON.parse(candidate);
        } catch {
            return;
        }
        const pc = peerConnections.get(from);
        if (pc?.remoteDescription) {
            await pc.addIceCandidate(parsed).catch(() => {});
        } else {
            const list = pendingCandidates.get(from) ?? [];
            list.push(parsed);
            pendingCandidates.set(from, list);
        }
    }

    async function start() {
        isConnecting.value = true;

        try {
            localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (e) {
            onError?.(e instanceof Error ? e.message : "Failed to access camera/mic");
            isConnecting.value = false;
            return;
        }

        const token = authStore.session?.access_token ?? "";
        const wsUrl = `${config.public.wsUrl}/rooms/ws/${roomId}?token=${token}`;
        ws = new WebSocket(wsUrl);

        ws.onmessage = async (ev) => {
            let msg: ServerSignal;
            try {
                msg = JSON.parse(ev.data);
            } catch {
                return;
            }

            switch (msg.type) {
                case "joined":
                    selfId.value = msg.user_id;
                    isConnecting.value = false;
                    for (const peerId of msg.peers) {
                        await makeOffer(peerId);
                    }
                    break;
                case "user_joined":
                    // existing peer waits for the new joiner to send an offer
                    break;
                case "user_left":
                    cleanupPeer(msg.user_id);
                    break;
                case "offer":
                    await handleOffer(msg.from, msg.sdp);
                    break;
                case "answer":
                    await handleAnswer(msg.from, msg.sdp);
                    break;
                case "ice_candidate":
                    await handleCandidate(msg.from, msg.candidate);
                    break;
                case "error":
                    onError?.(msg.message);
                    break;
            }
        };

        ws.onerror = () => onError?.("Connection error");
        ws.onclose = () => {
            if (!explicitClose) onError?.("Disconnected from call");
        };
    }

    function leave() {
        explicitClose = true;
        for (const peerId of [...peerConnections.keys()]) cleanupPeer(peerId);

        if (localStream.value) {
            for (const track of localStream.value.getTracks()) track.stop();
            localStream.value = null;
        }

        if (ws && ws.readyState !== WebSocket.CLOSED) ws.close();
        ws = null;
    }

    function toggleMic() {
        if (!localStream.value) return;
        const enabled = !isMicOn.value;
        for (const t of localStream.value.getAudioTracks()) t.enabled = enabled;
        isMicOn.value = enabled;
    }

    function toggleCam() {
        if (!localStream.value) return;
        const enabled = !isCamOn.value;
        for (const t of localStream.value.getVideoTracks()) t.enabled = enabled;
        isCamOn.value = enabled;
    }

    if (import.meta.client) {
        onBeforeUnmount(leave);
    }

    return {
        localStream: readonly(localStream),
        remotePeers: readonly(remotePeers),
        selfId: readonly(selfId),
        isMicOn: readonly(isMicOn),
        isCamOn: readonly(isCamOn),
        isConnecting: readonly(isConnecting),
        start,
        leave,
        toggleMic,
        toggleCam,
    };
}
