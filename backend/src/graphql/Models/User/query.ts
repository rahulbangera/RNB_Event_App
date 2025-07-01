import { builder } from "../../builder";

builder.queryField("getUser", (t) =>
	t.prismaField({
		type: "User",
		resolve: async (query, _root, _args, ctx) => {
			try {
				const user = await ctx.user;
				if (!user) {
					throw new Error("Unauthorized");
				}
				return ctx.prisma.user.findUnique({
					where: { id: user.id },
					...query,
				});
			} catch (error) {
				console.error("Error fetching user:", error);
				throw new Error("Failed to fetch user");
			}
		},
	}),
);

builder.queryField("getTopFiveAttendees", (t) => {
	return t.prismaField({
		type: ["User"],
		args: {
			eventId: t.arg({ type: "ID", required: true }),
		},
		errors: {
			types: [Error],
		},
		resolve: async (_query, _root, _args, ctx) => {
			try {
				console.log(_args);
				const user = await ctx.user;
				if (!user) {
					throw new Error("Unauthorized");
				}
				const attendees = await ctx.prisma.user.findMany({
					take: 5,
					orderBy: {
						createdAt: "desc",
					},
					where: {
						events: {
							some: {
								id: _args.eventId,
							},
						},
					},
				});
				console.log(attendees);
				if (!attendees) {
					return [];
				}
				return attendees;
			} catch (error) {
				console.error("Error fetching top five attendees:", error);
				throw new Error("Failed to fetch top five attendees");
			}
		},
	});
});
