import { builder } from "../../builder";

const EventCreateInput = builder.inputType("EventCreateInput", {
	fields: (t) => ({
		name: t.string({ required: true }),
		description: t.string({ required: false }),
		location: t.string({ required: true }),
		startTime: t.string({ required: true }),
	}),
});

builder.mutationField("createEvent", (t) =>
	t.prismaField({
		type: "Event",
		args: {
			data: t.arg({
				type: EventCreateInput,
				required: true,
			}),
		},
		resolve: async (_query, _root, args, ctx) => {
			try {
				if (!args.data.name || !args.data.location || !args.data.startTime) {
					throw new Error("Name, location, and start time are required");
				}
				const user = await ctx.user;
				if (!user) {
					throw new Error("Unauthorized");
				}
				if (user.role !== "ADMIN") {
					throw new Error("Permission denied");
				}
				return ctx.prisma.event.create({
					data: {
						name: args.data.name,
						description: args.data.description || null,
						location: args.data.location,
						startTime: args.data.startTime,
					},
				});
			} catch (error) {
				console.error("Error creating event:", error);
				throw new Error("Failed to create event");
			}
		},
	}),
);

builder.mutationField("addAttendeeToEvent", (t) =>
	t.prismaField({
		type: "Event",
		args: {
			eventId: t.arg({ type: "ID", required: true }),
			userId: t.arg({ type: "ID", required: true }),
		},
		errors: {
			types: [Error],
		},
		resolve: async (_query, _root, args, ctx) => {
			try {
				const user = await ctx.user;
				if (!user) {
					throw new Error("Unauthorized");
				}
				const userFound = await ctx.prisma.user.findUniqueOrThrow({
					where: { id: args.userId },
				});
				if (!userFound) {
					throw new Error("User not found");
				}
				const event = await ctx.prisma.event.findUniqueOrThrow({
					where: { id: args.eventId },
				});
				if (!event) {
					throw new Error("Event not found");
				}
				const attendee = await ctx.prisma.event.findUnique({
					where: {
						id: args.eventId,
						attendee: {
							some: {
								id: args.userId,
							},
						},
					},
				});
				if (attendee) {
					throw new Error("User is already an attendee of this event");
				}
				const updated = await ctx.prisma.event.update({
					where: { id: args.eventId },
					data: {
						attendee: {
							connect: { id: args.userId },
						},
					},
				});

				ctx.io?.emit("event:attendeeAdded", {
					eventId: args.eventId,
					userName: userFound.name,
					userImage: userFound.imageUrl || null,
				});

				return updated;
			} catch (error) {
				console.error("Error adding attendee to event:", error);
				throw new Error("Failed to add attendee to event");
			}
		},
	}),
);
