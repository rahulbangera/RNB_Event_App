import {
	Text,
	type TextStyle,
	TouchableOpacity,
	type ViewStyle,
} from "react-native";

export default function TouchableButton({
	title,
	onPress,
	style,
	textStyle,
	className,
	activeOpacity = 0.2,
	disabled = false,
	children,
}: {
	title: string;
	onPress: () => void;
	style?: ViewStyle;
	textStyle?: TextStyle;
	className?: string;
	activeOpacity?: number;
	disabled?: boolean;
	children?: React.ReactNode;
}) {
	return (
		<TouchableOpacity
			activeOpacity={activeOpacity}
			disabled={disabled}
			onPress={onPress}
			style={style}
			className={className}
		>
			{children ? children : <Text style={textStyle}>{title}</Text>}
		</TouchableOpacity>
	);
}
