import type React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import COLORS from "../constants/colors";

export default function SafeScreen({
	children,
}: {
	children: React.ReactNode;
}) {
	const insets: { top: number; bottom: number; left: number; right: number } =
		useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: 24,
		backgroundColor: COLORS.primaryBlueShade,
	},
});
