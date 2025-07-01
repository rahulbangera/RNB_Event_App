import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { initSocket } from "@/sockets/socket";
import "../styles/global.css";
import { Alert, View } from "react-native";
import { useAuthStore, User } from "@/stores/useAuthStore";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();
export default function RootLayout() {
	const [loggedIn, setLoggedIn] = useState(false);
	const { token, hasHydrated, user, isLoading, checkAuth } = useAuthStore() as {
		user: User | null;
		token: string | null;
		hasHydrated: boolean;
		isLoading: boolean;
		checkAuth: () => Promise<void>;
	};

	const initialProcess = async () => {
		console.log("Initial process started");
		await checkAuth();
		if (!isLoading) {
			if (token) {
				setLoggedIn(true);
			}
		}
	};

	useEffect(() => {
		initSocket();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Initial process should run only once
	useEffect(() => {
		if (hasHydrated) {
			console.log("Auth store has hydrated");
			if (user && token) {
				setLoggedIn(true);
				initialProcess();
				if (!token) {
					setLoggedIn(false);
					Alert.alert("Session Expired", "Please log in again.");
				}
			} else {
				setLoggedIn(false);
			}
		}
	}, [token, user, hasHydrated]);

	if (isLoading && !loggedIn) {
		return (
			<SafeAreaProvider>
				<SafeScreen>
					<View className="flex-1 items-center justify-center bg-primaryBlueShade">
						<View className="w-16 h-16 bg-primaryYellowShade rounded-full animate-pulse" />
					</View>
				</SafeScreen>
			</SafeAreaProvider>
		);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<StatusBar translucent backgroundColor="tranparent" style="light" />
			<SafeAreaProvider>
				<SafeScreen>
					<Stack
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Protected guard={!loggedIn}>
							<Stack.Screen name="(auth)" />
						</Stack.Protected>
						<Stack.Protected guard={loggedIn}>
							<Stack.Screen name="(tabs)" />
						</Stack.Protected>
					</Stack>
					<Toast position="bottom" />
				</SafeScreen>
			</SafeAreaProvider>
		</QueryClientProvider>
	);
}
