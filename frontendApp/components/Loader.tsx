import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import COLORS from "@/constants/colors";

export const Loader = () => {
	return (
		<View 
			style={{
				flex: 1,
				backgroundColor: COLORS.primaryBlueShade,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View
				style={{
					width: 60,
					height: 60,
					borderRadius: 30,
					backgroundColor: COLORS.primaryYellowShade,
					opacity: 0.8,
				}}
				className="justify-center items-center"
			>
				<View
					style={{
						width: 60,
						height: 60,
						borderRadius: 30,
						backgroundColor: COLORS.primaryYellowShade,
						opacity: 0.8,
						position: "absolute",
					}}
					className="absolute"
				>
					<PulsingCircle color={COLORS.primaryYellowShade} />
				</View>
			</View>
		</View>
	);
};

const PulsingCircle = ({ color }: { color: string }) => {
	const scale = useRef(new Animated.Value(1)).current;
	const opacity = useRef(new Animated.Value(0.7)).current;

	useEffect(() => {
		const pulse = Animated.loop(
			Animated.parallel([
				Animated.sequence([
					Animated.timing(scale, {
						toValue: 1.5,
						duration: 900,
						easing: Easing.out(Easing.ease),
						useNativeDriver: true,
					}),
					Animated.timing(scale, {
						toValue: 1,
						duration: 900,
						easing: Easing.in(Easing.ease),
						useNativeDriver: true,
					}),
				]),
				Animated.sequence([
					Animated.timing(opacity, {
						toValue: 0.2,
						duration: 900,
						easing: Easing.out(Easing.ease),
						useNativeDriver: true,
					}),
					Animated.timing(opacity, {
						toValue: 0.7,
						duration: 900,
						easing: Easing.in(Easing.ease),
						useNativeDriver: true,
					}),
				]),
			]),
		);
		pulse.start();
		return () => pulse.stop();
	}, [scale, opacity]);

	return (
		<Animated.View
			style={{
				width: 60,
				height: 60,
				borderRadius: 30,
				backgroundColor: color,
				position: "absolute",
				opacity,
				transform: [{ scale }],
			}}
		/>
	);
};
