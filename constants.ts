import { Appearance } from "react-native";

export const SERVER = "https://wcj-backend-new.vercel.app";
// export const SERVER = "http://localhost:3001";

export const DEFAULT_AUTH_CONTEXT = {
  user: null,
  login: async () => {return ""},
  signup: async () => {return ""},
  logout: async () => {},
  updateUser: async () => {},
  mounted: false,
};

const colorScheme = Appearance.getColorScheme();

export const colors =
  colorScheme === "light"
    ? {
        primary: "#00a2a2",
        background: "#fff",
        backgroundSecondary: "#eee",
        border: "#ddd",
        borderSecondary: "#ccc",
        text: "#000",
        textSecondary: "#999",
      }
    : {
        primary: "#00a2a2",
        background: "#000",
        backgroundSecondary: "#111",
        border: "#222",
        borderSecondary: "#333",
        text: "#fff",
        textSecondary: "#666",
      };
