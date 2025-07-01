import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "@/constants/colors";

export default function _layout() {
	const insets = useSafeAreaInsets();
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: COLORS.primaryYellowShade,
				headerTitleStyle: {
					color: COLORS.secondaryBlueShade,
					fontSize: 20, // NO USE UNITL HEADERSHOWN IS FALSE
					fontWeight: "bold",
				},
				tabBarStyle: {
					backgroundColor: COLORS.secondaryBlueShade,
					borderTopWidth: 0,
					shadowColor: "white",
					shadowOffset: { width: 0, height: -2 },
					shadowOpacity: 0.1,
					paddingTop: 12,
					paddingBottom: 5,

					height: 60 + insets.bottom,
				},
				headerShadowVisible: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarLabel: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="events"
				options={{
					tabBarLabel: "Events",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="checkmark-done-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarLabel: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
