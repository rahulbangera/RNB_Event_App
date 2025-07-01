import process from "node:process";
import jwt from "jsonwebtoken";
import { z } from "zod";

export const JWT_SECRET = `${process.env.JWT_SECRET}access`;

// export const secrets = {
// 	JWT_SECRET: JWT_SECRET,
// 	// JWT_REFRESH_SECRET: `${process.env.JWT_SECRET}refresh`,
// };

export const accessTokenZ = z.object({
	userId: z.string(),
});

type AccessToken = z.infer<typeof accessTokenZ>;

const generateAccessToken = (userId: string) => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined");
	}
	return jwt.sign({ userId } satisfies AccessToken, JWT_SECRET, {
		expiresIn: "30d",
	});
};

// export const refreshTokenZ = z.object({
// 	userId: z.string(),
// 	jti: z.string(),
// });

// type RefreshToken = z.infer<typeof access>;

// export const generateRefreshToken = (userId: string, jti: string) => {
// 	if (!JWT_SECRET) {
// 		throw new Error("JWT_SECRET is not defined");
// 	}
// 	return jwt.sign({ userId, jti } satisfies RefreshToken, secrets.JWT_REFRESH_SECRET, {
// 		expiresIn: "7d",
// 	});
// };

// export const verifyRefreshToken = (token: string) => {
// 	if (!JWT_SECRET) {
// 		throw new Error("JWT_SECRET is not defined");
// 	}
// 	try {
// 		return jwt.verify(token, secrets.JWT_REFRESH_SECRET) as RefreshToken;
// 	} catch (error) {
// 		console.error("Error verifying refresh token:", error);
// 		throw new Error("Invalid refresh token");
// 	}
// };

export const generateTokens = (userId: string) => {
	const token = generateAccessToken(userId);
	// const refreshToken = generateRefreshToken(userId, jti);
	return { token };
};
