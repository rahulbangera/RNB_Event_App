import { GraphQLClient } from "graphql-request";
import { useAuthStore } from "@/stores/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useGraphQLClient = () => {
	const {token} = useAuthStore.getState();

	return new GraphQLClient("http://localhost:4000/graphql", {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
};
