import { GraphQLClient } from "graphql-request";
import { useAuthStore } from "@/stores/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/api";

export const useGraphQLClient = () => {
	const { token } = useAuthStore.getState();

	return new GraphQLClient(`${API_URL}/graphql`, {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
};
