import TouchableButton from "@/components/TouchableButton";
import { useAuthStore, useEventStore } from "@/stores/useAuthStore";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function profile() {
	const { user, hasHydrated, logout } = useAuthStore();
	const [isLoading, setIsLoading] = useState(true);
	const { eventCount } = useEventStore() as {
		eventCount: number;
	};

	useEffect(() => {
		if (!hasHydrated) return;
		setIsLoading(true);
		if (!user) {
			logout().catch((error) => {
				console.error("Logout failed:", error);
			});
		}
		setIsLoading(false);
	}, [hasHydrated, user, logout]);

	return (
		<View className="flex-1 bg-primaryBlueShade items-center justify-between">
			<View className="w-full items-center">
				<View className="mt-4">
					<Text className="text-gray-400 text-2xl font-bold">My Profile</Text>
				</View>
				<View className="w-48 h-48 mt-12 rounded-full border-primaryYellowShade border-[6px] ">
					{!isLoading && user?.imageUrl ? (
						<Image
							source={{
								uri: user?.imageUrl,
							}}
							style={{ width: "100%", height: "100%", borderRadius: 9999 }}
							contentFit="cover"
							transition={1000}
							cachePolicy={"memory-disk"}
						/>
					) : null}
				</View>
				<View className="mt-6 gap-1">
					<Text className="text-whiteShade text-3xl text-center font-bold">
						{user?.name || "User Name"}
					</Text>
					<Text className="text-gray-400 text-lg text-center">
						{user?.email || "User Email"}
					</Text>
				</View>
				<View className="mt-8 w-[90%] px-4">
					<View className="bg-optionalShade p-4 rounded-xl flex items-center justify-center">
						<Text className="color-primaryYellowShade text-5xl font-bold">
							{eventCount || 0}
						</Text>
						<Text className="text-gray-400"> Events Joined</Text>
					</View>
				</View>
			</View>
			<View className="bottom-0 w-full px-4 py-6 flex-row justify-center items-center">
				<TouchableButton
					className="p-6 w-1/4 self-center rounded-2xl bg-[#25314f]"
					title="Log Out"
					textStyle={{ color: "white" }}
					onPress={() => logout()}
				/>
			</View>
		</View>
	);
}
