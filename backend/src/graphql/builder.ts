import SchemaBuilder from "@pothos/core";
import ErrorsPlugin from "@pothos/plugin-errors";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import type { YogaContext } from "../context";
import { DateTimeResolver } from "graphql-scalars";

import { prisma } from "../db";

const builder = new SchemaBuilder<{
	PrismaTypes: PrismaTypes;
	Context: YogaContext;
	Scalars: {
		DateTime: {
			Input: Date;
			Output: Date;
		};
	};
}>({
	plugins: [PrismaPlugin, ErrorsPlugin],
	errors: {
		defaultTypes: [],
	},
	prisma: {
		client: prisma,
	},
});

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.objectType(Error, {
	name: "Error",
	fields: (t) => ({
		message: t.string({
			resolve: (root) =>
				root.name === "Error" ? root.message : "Something went wrong",
		}),
	}),
});

builder.queryType({});
builder.mutationType({});
export { builder };
