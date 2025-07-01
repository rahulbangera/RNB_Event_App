import type { User } from "../../../../generated/prisma";
import { builder } from "../../builder";
import "./mutation";
import "./query";

builder.prismaObject("User", {
	description: "A user in the system",
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		email: t.exposeString("email"),
		role: t.exposeString("role"),
		imageUrl: t.exposeString("imageUrl", {
			nullable: true,
		}),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
	}),
});
