import { createYoga } from "graphql-yoga";
import type { Server as SocketIoServer } from "socket.io";
import { yogaContext } from "../context";
import { pothosSchema } from "./schema";

let ioInstance: SocketIoServer | undefined;

export const setupYoga = (io?: SocketIoServer) => {
	ioInstance = io;

	const yoga = createYoga({
		context: ({ request }) => yogaContext({ request, io: ioInstance }),
		schema: pothosSchema,
		graphqlEndpoint: "/graphql",
		logging: "error",
	});
	return yoga;
};
