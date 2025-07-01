import { useMutation } from "@tanstack/react-query";
import {
	ACCESS_TOKEN_MUTATION,
	LOGIN_MUTATION,
	SIGNUP_MUTATION,
} from "@/graphql/mutations/auth";
import { useGraphQLClient } from "@/utils/graphqlClient";

type SignupInput = {
	name: string;
	email: string;
	password: string;
};

type SignInInput = {
	email: string;
	password: string;
};

type ResponseData = {
	// Mutation only type have to test more to confirm fully
	_typename?: string;
	message?: string;
	data: {
		[key: string]: any;
	};
};

export const useSignUp = () => {
	const client = useGraphQLClient();
	return useMutation({
		mutationFn: async (input: SignupInput) => {
			const variables = {
				input,
			};
			const res = (await client.request(SIGNUP_MUTATION, variables.input)) as {
				signUp: ResponseData;
			};
			return res.signUp as ResponseData;
		},
	});
};

export const useSignIn = () => {
	const client = useGraphQLClient();
	return useMutation({
		mutationFn: async (input: SignInInput) => {
			const variables = {
				input,
			};
			console.log("Variables:", variables);
			const res = (await client.request(LOGIN_MUTATION, variables.input)) as {
				login: ResponseData;
			};
			console.log("Login Response:", res);
			return res.login as ResponseData;
		},
	});
};
