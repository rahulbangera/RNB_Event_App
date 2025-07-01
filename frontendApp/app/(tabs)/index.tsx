import { EventQueryType, fetchEvents } from "@/hooks/eventHook";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { SharedElement } from "react-native-shared-element";
import { useFocusEffect, useNavigation } from "expo-router";
import { useRouter } from "expo-router";
import {
	Alert,
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Image } from "expo-image";
import { Loader } from "@/components/Loader";
import COLORS from "@/constants/colors";
import { useAuthStore, useEventStore } from "@/stores/useAuthStore";

export type EventType = {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
	location: string;
	startTime: Date;
	attendee: {
		id: string;
	}[];
};

export default function index() {
	const router = useRouter();
	const [events, setEvents] = useState<EventType[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const { user } = useAuthStore();
	const { eventCount, setEventCount } = useEventStore() as {
		eventCount: number;
		setEventCount: (count: number) => void;
	};

	const {
		data: eventsData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["events"],
		queryFn: fetchEvents,
	});

	useFocusEffect(
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useCallback(() => {
			refetch();
		}, []),
	);

	const handleRefetch = () => {
		try {
			setRefreshing(true);
			refetch();
			if (eventsData?.__typename !== "QueryGetEventsSuccess") {
				throw new Error("Failed to fetch events. Please try again later.");
			}
		} catch (err) {
			Alert.alert("Error", "Failed to fetch events. Please try again later.");
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (Array.isArray(eventsData?.data)) {
			setEvents(eventsData.data);
		} else {
			setEvents([]);
		}
	}, [eventsData]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <we dont need to add events here>
	useEffect(() => {
		if (events) {
			let count = 0;
			console.log("Changing");
			events.forEach((e) => {
				if (e.attendee.some((attendee) => attendee.id === user?.id)) {
					count++;
				}
			});
			setEventCount(count);
		}
	}, [eventsData, events]);

	if (isLoading) {
		return <Loader />;
	}

	const renderItem = (event: EventType) => {
		const ifJoined = event.attendee.some((attendee) => attendee.id === user?.id)
			? "true"
			: "false";
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				className="mb-4"
				onPress={() =>
					router.push({
						pathname: "/eventsView",
						params: { event: JSON.stringify(event), ifJoined: ifJoined },
					})
				}
			>
				<View className="mt-6 bg-optionalShade rounded-lg shadow-lg pb-6">
					<View className="bg-optionalShade">
						<View className="relative">
							<Image
								source={{ uri: event.imageUrl }}
								style={{ aspectRatio: 16 / 9, borderRadius: 12 }}
							/>
						</View>
					</View>
					<View className="mt-4 mx-4">
						<Text className="text-whiteShade text-3xl font-bold">
							{event.name}
						</Text>
						<View className="flex-row items-center justify-between mt-2 gap-2">
							<View className="flex-row items-center gap-2">
								<Ionicons name="calendar-outline" size={18} color="green" />
								<Text className="text-lg text-gray-500">{`${new Date(event.startTime).toLocaleDateString()} ${new Date(event.startTime).toLocaleTimeString()}`}</Text>
							</View>
							{event.attendee.some((attendee) => attendee.id === user?.id) && (
								<View>
									<Text className="text-lg text-primaryYellowShade/60 mr-2">
										Already Joined
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};
	return (
		<View className="flex-1 bg-primaryBlueShade px-4">
			<Text className="text-whiteShade text-3xl font-bold text-center p-4">
				RNB <Text className="text-primaryYellowShade">Events</Text>
			</Text>
			<FlatList
				data={events || []}
				renderItem={({ item }) => renderItem(item)}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => handleRefetch()}
						colors={[COLORS.primaryYellowShade]}
						tintColor={COLORS.primaryYellowShade}
					/>
				}
				className="mt-4"
				contentContainerStyle={{ paddingBottom: 40 }}
				ListEmptyComponent={
					<View className="flex-1 items-center justify-center">
						<Text className="text-whiteShade text-lg">No events found.</Text>
					</View>
				}
			/>
		</View>
	);
}
