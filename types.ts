import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type PostType = {
  id: number;
  word: string;
  def: string;
  postedbyid: number;
  postedbyusername: string;
  likes: number[];
  createdat: number;
  ispublic: boolean;
};

export type UserType = {
  id: number;
  uname: string;
  password: string;
  profileimage: string;
  following: number[];
  followers: number[];
};

export type AuthContextType = {
  user: UserType | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newUser: any) => Promise<void>;
  mounted: boolean;
};

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Signin: undefined;
  Post: undefined;
  Search: undefined;
  User: { id: number };
  Account: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export type RoutesType =
  | "Home"
  | "Post"
  | "Search"
  | "Account"
  | "User"
  | "Signin";
