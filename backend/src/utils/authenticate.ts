import type { YogaInitialContext } from "@graphql-yoga/node";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { PrismaClient } from "../../generated/prisma/client";
import { accessTokenZ, JWT_SECRET } from "./jwt";

const authenticateUser = async (
	prisma: PrismaClient,
	request: YogaInitialContext["request"],
) => {
	if (!request.headers) {
		return null;
	}

	const authHeader = request.headers.get("authorization");
	const token = authHeader?.replace("Bearer ", "");
	if (!token) {
		return null;
	}

	try {
		const payload = jwt.verify(
			token ?? "",
			JWT_SECRET,
			
		) as JwtPayload;

		const { success, data: typedPayLoad } = accessTokenZ.safeParse(payload);
		if (!success) {
			return null;
		}

		return await prisma.user.findUnique({
			where: {
				id: typedPayLoad.userId,
			},
		});
	} catch (error) {
		console.error("Authentication error:", error);
		return null;
	}
};

export { authenticateUser };
