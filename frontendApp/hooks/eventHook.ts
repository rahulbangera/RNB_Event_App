import { useMutation, useQuery } from "@tanstack/react-query";
import {
	ADD_ATTENDEE_MUTATION,
	CREATE_EVENT_MUTATION,
	GET_EVENTS_QUERY,
	GET_TOP_FIVE_ATTENDEES_QUERY,
} from "@/graphql/mutations/event";
import { useGraphQLClient } from "@/utils/graphqlClient";

export type EventQueryType = {
	id: string;
	name: string;
	description: string;
	startTime: string;
	location: string;
};

type ResponseData = {
	// Mutation only type have to test more to confirm fully
	__typename?: string;
	message?: string;
	data: {
		events: Event[];
	};
};

export const useCreateEvent = () => {
	const client = useGraphQLClient();
	return useMutation({
		mutationFn: async (input: {
			name: string;
			description: string;
			startTime: string;
			location: string;
		}) => {
			const variables = {
				input,
			};
			const res = (await client.request(
				CREATE_EVENT_MUTATION,
				variables.input,
			)) as {
				createEvent: ResponseData;
			};
			return res.createEvent as ResponseData;
		},
	});
};

export const fetchEvents = async () => {
	const client = useGraphQLClient();
	const res = (await client.request(GET_EVENTS_QUERY)) as {
		getEvents: ResponseData | ResponseData[];
	};
	return res.getEvents as ResponseData;
};

export const fetchTopFiveAttendees = async (eventId: string) => {
	const client = useGraphQLClient();
	const res = (await client.request(GET_TOP_FIVE_ATTENDEES_QUERY, {
		eventId,
	})) as {
		getTopFiveAttendees: {
			__typename: string;
			message?: string;
			data: {
				imageUrl: string;
			}[];
		};
	};
	return res.getTopFiveAttendees as {
		__typename: string;
		message?: string;
		data: {
			imageUrl: string;
		}[];
	};
};

export const useAddAttendeeToEvent = async () => {
	const client = useGraphQLClient();
	return useMutation({
		mutationFn: async (input: { eventId: string; userId: string }) => {
			const variables = { input };
			console.log("Adding attendee with variables:", variables.input);
			const res = (await client.request(
				ADD_ATTENDEE_MUTATION,
				variables.input,
			)) as {
				addAttendeeToEvent: ResponseData;
			};
			return res.addAttendeeToEvent as ResponseData;
		},
	});
};
