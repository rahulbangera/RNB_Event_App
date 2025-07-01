import { builder } from "../../builder";
import "./query";
import "./mutation";

builder.prismaObject("Event", {
	fields: (t) => ({
		id: t.exposeID("id"),
		location: t.exposeString("location", { nullable: true }),
		name: t.exposeString("name"),
		description: t.exposeString("description", { nullable: true }),
		startTime: t.expose("startTime", { type: "DateTime" }),
		imageUrl: t.exposeString("imageUrl", {
			nullable: true,
		}),
		attendee: t.relation("attendee", { nullable: true }),
	}),
});
