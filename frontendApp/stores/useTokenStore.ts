import { create } from "zustand";

export const useTokenStore = create<{
	accessToken: string | null;
}>((set) => ({
	accessToken: null,
	setAccessToken: (token: string | null) => set({ accessToken: token }),
}));
