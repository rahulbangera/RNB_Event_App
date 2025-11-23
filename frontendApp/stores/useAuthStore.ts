import { useGraphQLClient } from "@/utils/graphqlClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GraphQLClient } from "graphql-request";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { API_URL } from "@/constants/api";

export interface User {
	id: string;
	email: string;
	name: string;
	role: string;
	imageUrl: string;
}

interface AuthState {
	token: string | null;
	user: User | null;
	setUser: (user: User | null) => void;
	isLoading: boolean;
	hasHydrated: boolean;
	checkAuth: () => Promise<void>;
	setHydrated: (hydrated: boolean) => void;
	setToken: (token: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const useEventStore = create(() => ({
	eventCount: 0,
	setEventCount: (count: number) => {
		useEventStore.setState({ eventCount: count });
	},
}));

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			token: null,
			isLoading: false,
			hasHydrated: false,
			user: null,
			setHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
			setUser: (user: User | null) => set({ user }),
			checkAuth: async () => {
				const token = get().token;
				if (!token) {
					set({ token: null, isLoading: false });
					return;
				}
				set({ token: token });
				const client = new GraphQLClient(`${API_URL}/graphql`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				try {
					const res = await client.request(
						`query MyQuery {
							getUser {
								email
								id
								name
								role
								imageUrl
							}
							}`,
					);
				} catch (error) {
					console.error("Failed to fetch user data:", error);
					set({ token: null, user: null, isLoading: false });
					return;
				}
				set({ isLoading: false });
			},

			setToken: async (token: string) => {
				try {
					set({ token: token, isLoading: false });
				} catch (error) {
					console.error("Failed to set token:", error);
				}
			},

			logout: async () => {
				try {
					set({ token: null });
				} catch (error) {
					console.error("Failed to logout:", error);
				}
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => AsyncStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated(true);
			},
		},
	),
);
