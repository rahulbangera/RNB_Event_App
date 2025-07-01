import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Event from "./index";

const Stack = createNativeStackNavigator();
export default function _layout() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				animation: "flip",
				presentation: "card",
			}}
		>
			<Stack.Screen name="index" options={{animation: "flip"}} component={Event} />
		</Stack.Navigator>
	);
}
