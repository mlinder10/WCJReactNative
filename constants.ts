export const SERVER = "https://wcj-backend-new.vercel.app";
// export const SERVER = "http://localhost:3001";

export const DEFAULT_AUTH_CONTEXT = {
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  mounted: false,
};
