import {
	View,
	Text,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import type { EventType } from "../(tabs)";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import TouchableButton from "@/components/TouchableButton";
import { useQuery } from "@tanstack/react-query";
import { getSocket } from "@/sockets/socket";
import {
	fetchTopFiveAttendees,
	useAddAttendeeToEvent,
} from "@/hooks/eventHook";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/useAuthStore";

export default function EventView() {
	const router = useRouter();
	const addAttendee = useAddAttendeeToEvent();
	const { user } = useAuthStore();
	const { event, ifJoined } = useLocalSearchParams();
	const parsedEvent: EventType =
		typeof event === "string" ? JSON.parse(event) : event;
	const eventId = parsedEvent.id;
	const [attendees, setAttendees] = React.useState<string[]>([]);
	const [isJoining, setIsJoining] = React.useState(false);
	const [alreadyJoined, setAlreadyJoined] = React.useState(false);
	const {
		data: attendeesData,
		isLoading: isAttendeesLoading,
		error: attendeesError,
		refetch: refetchAttendees,
	} = useQuery({
		queryKey: ["eventId", eventId],
		queryFn: () => fetchTopFiveAttendees(eventId),
		enabled: !!eventId,
	});

	useEffect(() => {
		if (
			attendeesData &&
			attendeesData.__typename === "QueryGetTopFiveAttendeesSuccess"
		) {
			const topAttendees = attendeesData.data.map(
				(attendeeImage: { imageUrl: string }) => attendeeImage.imageUrl,
			);
			setAttendees(topAttendees);
		} else {
			console.log("Error fetching attendees:", attendeesError);
		}
		console.log("Attendees Data:", attendeesData);
	}, [attendeesData, attendeesError]);

	useEffect(() => {
		const socket = getSocket();
		if (!socket) {
			console.error("Socket is not initialized");
			return;
		}
		const listener = (data: {
			eventId: string;
			userName: string;
			userImage: string;
		}) => {
			console.log("Called");
			if (data.eventId === eventId) {
				setAttendees((prev) =>
					prev.includes(data.userImage) ? prev : [...prev, data.userImage],
				);
				Toast.show({
					type: "info",
					text1: `${data.userName} has joined the event!`,
					position: "bottom",
					bottomOffset: 120,
					visibilityTime: 3000,
				});
			}
		};
		socket.on("event:attendeeAdded", listener);

		return () => {
			socket.off("event:attendeeAdded", listener);
		};
	}, [eventId]);

	useEffect(() => {
		console.log(attendees);
	}, [attendees]);

	const joinEvent = async () => {
		try {
			if (!eventId) {
				throw new Error("Event ID is required to join the event.");
			}
			if (!user?.id) {
				throw new Error("Please log in again to join the event.");
			}
			const response = await (await addAttendee).mutateAsync({
				eventId,
				userId: user.id,
			});
			console.log("Join Event Response:", response);
			if (response.__typename !== "MutationAddAttendeeToEventSuccess") {
				throw new Error(
					response.message || "Failed to join the event. Please try again.",
				);
			}
			setAlreadyJoined(true);
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "An unexpected error occurred.",
			);
		} finally {
			setIsJoining(true);
		}
	};

	useEffect(() => {
		if (parsedEvent.attendee.some((attendee) => attendee.id === user?.id)) {
			setAlreadyJoined(true);
		}
	}, [parsedEvent.attendee, user?.id]);

	return (
		<View className="flex-1 bg-primaryBlueShade">
			<View className="flex flex-1 justify-between">
				<View>
					<View className="relative">
						<TouchableOpacity
							className="absolute left-4 top-4 z-10"
							onPress={() => router.back()}
						>
							<Ionicons name="chevron-back" size={32} color={"white"} />
						</TouchableOpacity>
						<Text className="text-whiteShade text-3xl font-bold text-center p-4">
							Event <Text className="text-primaryYellowShade">Details</Text>
						</Text>
					</View>
					<View className="p-4">
						<View className="w-full">
							<Image
								source={{ uri: parsedEvent.imageUrl }}
								style={{ aspectRatio: 16 / 9, borderRadius: 12 }}
							/>
						</View>
						<View>
							<Text className="text-whiteShade ml-2 text-3xl font-bold mt-4">
								{parsedEvent.name}
							</Text>
							<View className="flex-row justify-between p-2 mt-2">
								<View className="flex-row items-center gap-2">
									<Ionicons name="calendar-outline" size={22} color="green" />
									<Text className="text-lg text-gray-500">
										{`${new Date(parsedEvent.startTime).toLocaleDateString()} ${new Date(
											parsedEvent.startTime,
										).toLocaleTimeString()}`}
									</Text>
								</View>
								<View className="flex-row items-center gap-2">
									<Ionicons name="location-outline" size={22} color="blue" />
									<Text className="text-lg font-bold text-gray-500">
										{parsedEvent.location}
									</Text>
								</View>
							</View>
							<Text className="text-whiteShade text-lg ml-2 mt-2">
								{parsedEvent.description}
							</Text>
						</View>
						<View className="p-2 mt-4">
							<Text
								className="text-2xl text-whiteShade"
								style={{ fontStyle: "italic" }}
							>
								Attendees: (Live)
							</Text>
							<View className="flex-row flex-wrap gap-2 mt-2">
								{attendees.slice(0, 6).map((attendeeImage, index) => (
									<Image
										key={`image-${
											// biome-ignore lint/suspicious/noArrayIndexKey: <using index as key is acceptable here>
											index
										}`}
										source={{ uri: attendeeImage }}
										style={{
											width: 50,
											height: 50,
											borderRadius: 25,
										}}
									/>
								))}
								{attendees.length > 6 && (
									<View
										style={{
											width: 50,
											height: 50,
											borderRadius: 25,
											backgroundColor: "#ccc",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Text
											style={{
												color: "#222",
												fontWeight: "bold",
												fontSize: 18,
											}}
										>
											+{attendees.length - 6}
										</Text>
									</View>
								)}
								{isAttendeesLoading && (
									<ActivityIndicator size="small" color="white" />
								)}
								{attendees.length === 0 && !isAttendeesLoading && (
									<Text className="text-gray-400">No attendees yet</Text>
								)}
							</View>
						</View>
					</View>
				</View>
				<View className="flex items-center justify-center mb-12">
					<TouchableButton
						title={alreadyJoined ? "Joined" : "Join Event"}
						onPress={async () => {
							if (!alreadyJoined) {
								setIsJoining(true);
								await joinEvent();
								setIsJoining(false);
							}
						}}
						disabled={alreadyJoined || isJoining || ifJoined === "true"}
						activeOpacity={0.7}
						style={{
							opacity:
								alreadyJoined || ifJoined === "true" || isJoining ? 0.5 : 1,
						}}
						className="p-4 bg-primaryYellowShade w-[90%] rounded-3xl"
					>
						{isJoining ? (
							<ActivityIndicator color="black" />
						) : (
							<Text
								style={{
									color: "black",
									textAlign: "center",
									fontSize: 16,
									fontWeight: 500,
								}}
							>
								{alreadyJoined || ifJoined === "true" ? "Joined" : "Join Event"}
							</Text>
						)}
					</TouchableButton>
				</View>
			</View>
		</View>
	);
}
