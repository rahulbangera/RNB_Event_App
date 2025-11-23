import TouchableButton from "@/components/TouchableButton";
import { useAuthStore } from "@/stores/useAuthStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Label } from "@react-navigation/elements";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useCreateEvent } from "@/hooks/eventHook";
import COLORS from "@/constants/colors";

export default function events() {
	const createEvent = useCreateEvent();
	const { user } = useAuthStore();
	DateTimePickerAndroid.open({value: new Date(), mode: "date", is24Hour: true});
	DateTimePickerAndroid.dismiss({		 	 });
	const [eventName, setEventName] = useState("");
	const [eventStartDate, setEventStartDate] = useState(
		new Date().toISOString(),
	);
	
	const [isValid, setIsValid] = useState(true);
	const [eventEndDate, setEventEndDate] = useState(new Date().toISOString());
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");

	useEffect(() => {
		if (eventName.trim() === "" || !eventStartDate || !location) {
			setIsValid(false);
		} else {
			setIsValid(true);
		}
	}, [eventName, eventStartDate, location]);

	const handleCreateEvent = async () => {
		try {
			if (!isValid) {
				throw new Error("Please fill all required fields.");
			}
			const res = await createEvent.mutateAsync({
				name: eventName,
				description,
				startTime: eventStartDate,
				location,
			});
			if (res.__typename !== "MutationCreateEventSuccess" && res.message) {
				throw new Error(res.message || "Event creation failed");
			}
			console.log("Event Created Successfully:", res);
			if (res) {
				setEventName("");
				setDescription("");
				setLocation("");
				setEventStartDate(new Date().toISOString());
				setEventEndDate(new Date().toISOString());
				Alert.alert(
					"Event Created",
					`Your event "${eventName}" has been created successfully!`,
				);
			}
		} catch (error) {
			console.error("Event Creation Error:", error);
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "An error occurred while creating the event.",
			);
		}
	};

	return (
		<View className="flex-1 bg-primaryBlueShade items-center">
			{user?.role === "ADMIN" ? (
				<View className="w-full items-center">
					<View className="mt-4">
						<Text className="text-gray-400 text-2xl font-bold">My Events</Text>
					</View>
					<View className="w-full mt-6 px-6 gap-4">
						<View className="mb-2 gap-1">
							<Label
								style={{
									opacity: 0.8,
									color: "lightyellow",
									marginBottom: 4,
									textAlign: "left",
								}}
							>
								Event Name
							</Label>
							<TextInput
								className="border border-gray-700 h-14 rounded-xl text-whiteShade bg-gray-800 px-4 pb-2 text-lg"
								placeholder="Enter event name"
								autoComplete="off"
								autoCorrect={false}
								placeholderTextColor={"gray"}
								value={eventName}
								onChangeText={setEventName}
							/>
						</View>
						<View className="mb-2 gap-1">
							<Label
								style={{
									color: "lightyellow",
									opacity: 0.8,
									marginBottom: 4,
									textAlign: "left",
								}}
							>
								Description (Optional)
							</Label>
							<View
								style={{
									height: 140,
									borderRadius: 12,
									borderWidth: 1,
									borderColor: "#374151",
									backgroundColor: "#1f2937",
									paddingHorizontal: 12,
									paddingVertical: 4,
								}}
							>
								<TextInput
									multiline
									scrollEnabled
									style={{
										flex: 1,
										color: "white",
										textAlignVertical: "top",
									}}
									placeholder="Enter description"
									className="text-whiteShade text-lg"
									autoComplete="off"
									autoCorrect={false}
									placeholderTextColor="gray"
									value={description}
									onChangeText={setDescription}
								/>
							</View>
						</View>
						<View className="mb-2 gap-1">
							<Label
								style={{
									color: "lightyellow",
									opacity: 0.8,
									marginBottom: 4,
									textAlign: "left",
								}}
							>
								Location
							</Label>
							<View className="w-full relative">
								<Ionicons
									name="location-outline"
									size={24}
									className="top-1/4"
									color="gray"
									style={{ position: "absolute", left: 16, zIndex: 1 }}
								/>
								<TextInput
									className="border border-gray-700 h-14 rounded-xl text-whiteShade bg-gray-800 pl-12 pr-4 text-lg pb-2"
									placeholder="Enter Location"
									placeholderTextColor={"gray"}
									autoComplete="off"
									autoCorrect={false}
									value={location}
									onChangeText={setLocation}
									style={{ paddingLeft: 44 }}
								/>
							</View>
						</View>
						<View className="mb-2 flex-row gap-4">
							<View className="flex-1">
								<Label
									style={{
										opacity: 0.8,
										color: "lightyellow",
										marginBottom: 4,
										textAlign: "left",
									}}
								>
									Start Time
								</Label>
								<RNDateTimePicker
									value={eventStartDate ? new Date(eventStartDate) : new Date()}
									mode="date"
									design ="material"
									textColor="#2D3748"
									accentColor="black"
									display="compact"
									onChange={(event, date) => {
										if (date) {
											setEventStartDate(date.toISOString());
										} else {
											setEventStartDate("");
										}
									}}
									style={{
										backgroundColor: "gray",
										borderRadius: 8,
										padding: 4,
									}}
								/>
							</View>
						</View>
						<TouchableButton
							onPress={handleCreateEvent}
							title="Create Event"
							disabled={!isValid}
							activeOpacity={0.7}
							className={`p-4 mt-4 bg-primaryYellowShade/70 rounded-3xl ${!isValid ? "opacity-50" : ""}`}
							textStyle={{
								textAlign: "center",
								fontWeight: "500",
								fontSize: 16,
							}}
						/>
					</View>
				</View>
			) : (
				<View className="flex-1 justify-center items-center px-8">
					<Ionicons name="lock-closed-outline" size={48} color={COLORS.primaryYellowShade} style={{ marginBottom: 16 }} />
					<Text className="text-whiteShade text-2xl font-bold text-center mb-2">
						Admins Only
					</Text>
					<Text className="text-gray-300 text-lg text-center mb-4">
						You do not have permission to create events.
					</Text>
					<Text className="text-gray-400 text-base text-center italic">
						Coming soon: My Events page for users!
					</Text>
				</View>
			)}
		</View>
	);
}
