/** @type {import('tailwindcss').Config} */
export const content = [
	"./App.{js,jsx,ts,tsx}",
	"./app/**/*.{js,jsx,ts,tsx}",
	"./components/**/*.{js,jsx,ts,tsx}",
];
export const presets = [require("nativewind/preset")];
export const theme = {
	extend: {
		colors: {
			secondaryBlueShade: "#051130",
			primaryBlueShade: "#09102B",
			primaryYellowShade: "#FF9F0C",
			optionalShade: "#212224",
			whiteShade: "#d5d8df",
		},
		borderColor: {
			secondaryBlueShade: "#051130",
			primaryBlueShade: "#09102B",
			primaryYellowShade: "#FF9F0C",
			optionalShade: "212224",
			whiteShade: "#d5d8df",
		},
	},
};
export const plugins = [];
