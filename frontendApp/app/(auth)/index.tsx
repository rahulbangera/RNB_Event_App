import { Link, useRouter } from "expo-router";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import TouchableButton from "@/components/TouchableButton";
import { useSignIn } from "@/hooks/authHook";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Home() {
	const router = useRouter();
	const signIn = useSignIn();

	const {setUser, setToken} = useAuthStore();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (email: string, password: string) => {
		try {
			if (!email || !password) {
				throw new Error("All fields are required");
			}
			if (!email.includes("@")) {
				throw new Error("Invalid email format");
			}
			if (password.length < 6) {
				throw new Error("Password must be at least 6 characters long");
			}
			const response = await signIn.mutateAsync({ email, password });
			console.log("Login Response:", response);
			if (response._typename !== "MutationLoginSuccess" && response.message) {
				throw new Error(response.message || "Login failed");
			}
			if (response) {
				const {email, name, role, token, id, imageUrl} = response.data;
				setToken(token);
				setUser({ email, name, role, id, imageUrl });
				Alert.alert("Login Successful", "You can now access your account.");
				router.replace("/");
			}
		} catch (error) {
			console.error("Login Error:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: "An error occurred during login";
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
				<Text className="text-5xl font-bold text-whiteShade">Welcome Back</Text>
				<Text className="mt-2 text-lg text-gray-400 text-center">
					Log in to continue using RNB Events.
				</Text>
				<View className=" gap-6 w-full flex items-center mt-6">
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
					<TextInput
						placeholder="Password"
						secureTextEntry={true}
						autoCorrect={false}
						autoCapitalize="none"
						keyboardType="default"
						value={password}
						onChangeText={(value) => setPassword(value)}
						className="bg-optionalShade h-16 rounded-lg w-[90%] px-6 color-whiteShade"
						placeholderTextColor={"grey"}
					/>
					<TouchableButton
						className="bg-primaryYellowShade w-[90%] p-5 rounded-xl"
						textStyle={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}
						title="Sign In"
						activeOpacity={0.6}
						onPress={() => handleLogin(email, password)}
					/>

					<View className="flex-row items-center justify-center w-[90%]">
						<Text className="text-lg text-gray-400">
							Don't have an account?{" "}
						</Text>
						<Link href={"/(auth)/signup"} asChild>
							<TouchableOpacity activeOpacity={0.7}>
								<Text className="text-primaryYellowShade text-lg font-semibold">
									Sign Up
								</Text>
							</TouchableOpacity>
						</Link>
					</View>
				</View>
			</View>
			<View>
				<Text className="text-lg text-gray-400 px-4 text-center pb-8">
					Having trouble logging in?{" "}
					<Text className="text-primaryYellowShade">Contact Support</Text>
				</Text>
			</View>
		</View>
	);
}
