import { useRouter } from "expo-router";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import TouchableButton from "@/components/TouchableButton";
import { useSignUp } from "@/hooks/authHook";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Home() {
	const router = useRouter();
	const signup = useSignUp();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const handleSignUp = async (
		name: string,
		email: string,
		password: string,
	) => {
		try {
			if (!name || !email || !password) {
				throw new Error("All fields are required");
			}
			if (!email.includes("@")) {
				throw new Error("Invalid email format");
			}
			if (password.length < 6) {
				throw new Error("Password must be at least 6 characters long");
			}
			if (name.length < 3) {
				throw new Error("Name must be at least 3 characters long");
			}
			if (password !== confirmPassword) {
				throw new Error("Passwords do not match");
			}
			const response = await signup.mutateAsync({ name, email, password });
			if (response._typename !== "MutationSignUpSuccess" && response.message) {
				throw new Error(response.message || "Sign up failed");
			}
			console.log("Sign Up Response:", response);
			if (response) {
				router.replace("/(auth)");
			}
			Alert.alert("Sign Up Successful", "You can now log in to your account.");
		} catch (error) {
			console.error("Sign Up Error:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "An error occurred during sign up";
			Alert.alert(errorMessage);
		}
	};

	return (
		<View className="flex-1 items-center justify-between bg-primaryBlueShade">
			<View className="p-4 rounded-lg shadow-lg">
				<Text
					className="text-3xl font-bold text-whiteShade"
					style={{ textAlign: "center" }}
				>
					RNB <Text className="text-primaryYellowShade">Events</Text>
				</Text>
			</View>
			<View className="p-4 w-full flex items-center">
				<Text className="text-5xl font-bold text-whiteShade">Join Us</Text>
				<Text className="mt-2 text-lg text-gray-400 text-center">
					Signup to get started with RNB Events.
				</Text>
				<View className=" gap-6 w-full flex items-center mt-6">
					<TextInput
						placeholder="Full Name"
						value={name}
						autoCorrect={false}
						autoCapitalize="words"
						keyboardType="default"
						onChangeText={(value) => setName(value)}
						className="bg-optionalShade h-16 rounded-lg w-[90%] px-6 color-whiteShade"
						placeholderTextColor={"grey"}
					/>
					<TextInput
						placeholder="Email"
						autoCorrect={false}
						autoCapitalize="none"
						keyboardType="email-address"
						value={email}
						onChangeText={(value) => setEmail(value)}
						className="bg-optionalShade h-16 rounded-lg w-[90%] px-6 color-whiteShade"
						placeholderTextColor={"grey"}
					/>
					<View className="w-[90%] relative">
						<TextInput
							placeholder="Password"
							secureTextEntry={!passwordVisible}
							autoCorrect={false}
							autoCapitalize="none"
							keyboardType="default"
							value={password}
							onChangeText={(value) => setPassword(value)}
							className="bg-optionalShade h-16 rounded-lg w-[100%] px-6 color-whiteShade"
							placeholderTextColor={"grey"}
						/>
						<TouchableOpacity
							className="absolute right-4 top-4"
							activeOpacity={0.7}
							onPress={() => setPasswordVisible(!passwordVisible)}
						>
							<Ionicons
								name={`${passwordVisible ? "eye-outline" : "eye-off"}`}
								size={24}
								color="grey"
							/>
						</TouchableOpacity>
					</View>
					<View className="w-[90%] relative">
						<TextInput
							placeholder="Password"
							secureTextEntry={!confirmPasswordVisible}
							autoCorrect={false}
							autoCapitalize="none"
							keyboardType="default"
							value={confirmPassword}
							onChangeText={(value) => setConfirmPassword(value)}
							className="bg-optionalShade h-16 rounded-lg w-[100%] px-6 color-whiteShade"
							placeholderTextColor={"grey"}
						/>
						<TouchableOpacity
							className="absolute right-4 top-4"
							activeOpacity={0.7}
							onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
						>
							<Ionicons
								name={`${confirmPasswordVisible ? "eye-outline" : "eye-off"}`}
								size={24}
								color="grey"
							/>
						</TouchableOpacity>
					</View>
					<TouchableButton
						className="bg-primaryYellowShade w-[90%] p-5 rounded-xl"
						textStyle={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}
						title="Sign Up"
						activeOpacity={0.6}
						onPress={() => handleSignUp(name, email, password)}
					/>

					<View className="flex-row items-center justify-center w-[90%]">
						<Text className="text-lg text-gray-400">
							Already have an account?{" "}
						</Text>
						<TouchableOpacity
							className="ml-1"
							activeOpacity={0.7}
							onPress={() => {
								router.replace("/(auth)");
							}}
						>
							<Text className="text-primaryYellowShade text-lg font-semibold">
								Login
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View>
				<Text className="text-lg text-gray-400 px-4 text-center pb-8">
					By signing up, you agree to our{" "}
					<Text className="text-primaryYellowShade">Terms of Service</Text> and{" "}
					<Text className="text-primaryYellowShade">Privacy Policy</Text>.
				</Text>
			</View>
		</View>
	);
}
