import { builder } from "../../builder";
import { generateTokens } from "../../../utils/jwt";
import bcrypt from "bcryptjs";

builder.mutationField("signUp", (t) =>
	t.prismaField({
		type: "User",
		args: {
			name: t.arg.string({ required: true }),
			email: t.arg.string({ required: true }),
			password: t.arg.string({ required: true }),
		},
		errors: {
			types: [Error],
		},
		resolve: async (query, root, args, ctx) => {
			if (!args.name || !args.email || !args.password) {
				throw new Error("All fields are required");
			}
			if (args.password.length < 6) {
				throw new Error("Password must be at least 6 characters long");
			}
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
				throw new Error("Invalid email format");
			}
			if (args.name.length < 2) {
				throw new Error("Name must be at least 2 characters long");
			}
			const existingUser = await ctx.prisma.user.findUnique({
				where: { email: args.email },
			});

			if (existingUser) {
				throw new Error("User already exists");
			}
			try {
				const hashedPassword = await bcrypt.hash(args.password, 10);

				return await ctx.prisma.user.create({
					data: {
						name: args.name,
						email: args.email,
						password: hashedPassword,
						imageUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${args.name.replace(/\s+/g, "")}`,
					},
				});
			} catch (error) {
				console.error("Error during sign up:", error);
				throw new Error("Failed to sign up user");
			}
		},
	}),
);

class Token {
	token: string;
	email: string;
	name: string;
	role: string;
	id: string;
	imageUrl?: string | null;

	constructor(
		token: string,
		email: string,
		name: string,
		role: string,
		id: string,
		imageUrl?: string | null,
	) {
		this.token = token;
		this.email = email;
		this.name = name;
		this.role = role;
		this.id = id;
		this.imageUrl = imageUrl ?? null;
	}
}

const AuthPayloadType = builder.objectType(Token, {
	name: "AuthPayload",
	fields: (t) => ({
		token: t.exposeString("token"),
		email: t.exposeString("email"),
		name: t.exposeString("name"),
		role: t.exposeString("role"),
		id: t.exposeID("id"),
		imageUrl: t.exposeString("imageUrl", {
			nullable: true,
		}),
	}),
});

builder.mutationField("login", (t) =>
	t.field({
		type: AuthPayloadType,
		args: {
			email: t.arg.string({ required: true }),
			password: t.arg.string({ required: true }),
		},
		errors: {
			types: [Error],
		},
		resolve: async (root, args, ctx) => {
			try {
				console.log(args);
				if (!args.email || !args.password) {
					throw new Error("Email and password are required");
				}
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
					throw new Error("Invalid email format");
				}
				if (args.password.length < 6) {
					throw new Error("Password must be at least 6 characters long");
				}
				const existingUser = await ctx.prisma.user.findUnique({
					where: { email: args.email },
				});

				if (!existingUser) {
					throw new Error("User not found");
				}

				const validPassword = await bcrypt.compare(
					args.password,
					existingUser.password,
				);

				if (!validPassword) {
					throw new Error("Invalid password");
				}

				const { token } = generateTokens(existingUser.id);

				return {
					token,
					email: existingUser.email,
					name: existingUser.name,
					role: existingUser.role,
					id: existingUser.id,
					imageUrl: existingUser.imageUrl || null,
				};
			} catch (error) {
				console.error("Error during sign up:", error);
				throw new Error(`${error}`);
			}
		},
	}),
);

// builder.mutationField("newAccessToken", (t) =>
// 	t.field({
// 		type: AuthPayloadType,
// 		args: {
// 			refreshToken: t.arg.string({ required: true }),
// 		},
// 		errors: {
// 			types: [Error],
// 		},
// 		resolve: async (root, args, ctx) => {
// 			const { refreshToken } = args;
// 			if (!refreshToken) {
// 				throw new Error("Refresh token is required");
// 			}
// 			try {
// 				const decoded = verifyRefreshToken(refreshToken);
// 				const user = await ctx.prisma.user.findUnique({
// 					where: { id: decoded.userId },
// 				});
// 				if (!user) {
// 					throw new Error("User not found");
// 				}
// 				const jti = uuidv4();
// 				const accessToken = generateRefreshToken(user.id, jti);
// 				return {
// 					accessToken,
// 					refreshToken,
// 					email: user.email,
// 					name: user.name,
// 					role: user.role,
// 				};
// 			} catch (error) {
// 				console.error("Error generating new access token:", error);
// 				throw new Error("Failed to generate new access token");
// 			}
// 		},
// 	}),
// );
