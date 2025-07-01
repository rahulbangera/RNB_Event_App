import { builder } from "../../builder";

builder.queryField("getEvents", (t) =>
	t.prismaField({
		type: ["Event"],
		errors: {
			types: [Error],
		},
		resolve: async (_query, _root, _args, ctx) => {
			try {
				const user = await ctx.user;
				if (!user) {
					throw new Error("Unauthorized");
				}
				return ctx.prisma.event.findMany({
					include: {
						attendee: {
							select: {
								id: true,
							},
						},
					},
				});
			} catch (error) {
				console.error("Error fetching events:", error);
				throw new Error("Failed to fetch events");
			}
		},
	}),
);
