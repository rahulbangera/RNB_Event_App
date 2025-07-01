import { initContextCache } from "@pothos/core";
import type { Server as SocketIoServer } from "socket.io";
import { prisma } from "./db";
import { authenticateUser } from "./utils/authenticate";

export interface Context {
	io?: SocketIoServer;
	[key: string]: any;
}

interface AuthenticatedContext extends Context {
	io?: SocketIoServer;
}

const yogaContext = ({ request: req, io }: AuthenticatedContext) => {
	const cache = initContextCache();
	const user = authenticateUser(prisma, req);
	return {
		...cache,
		prisma,
		user: user,
		req,
		io,
	};
};

type YogaContext = ReturnType<typeof yogaContext>;

export type { YogaContext };
export { yogaContext };
