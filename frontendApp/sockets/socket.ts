import type { Socket } from "socket.io-client";
import io from "socket.io-client";

let socket: typeof Socket | null = null;

export const initSocket = () => {
	if (!socket) {
		socket = io("http://localhost:4000", {
			transports: ["websocket"],
		});

		socket.on("connect", () => {
			console.log("Socket connected:", socket?.id);
		});

		socket.on("disconnect", () => {
			console.log("Socket disconnected");
		});
	}
};

export const getSocket = () => socket;
