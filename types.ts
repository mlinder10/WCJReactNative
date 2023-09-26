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
  login: (username: string, password: string) => Promise<string>;
  signup: (
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<string>;
  logout: () => Promise<void>;
  updateUser: (newUser: any) => Promise<void>;
  mounted: boolean;
};

export type RootStackParamList = {
  Signin: undefined;
  Home: undefined;
  Post: undefined;
  Search: undefined;
  Account: undefined;
  User: { id: number };
  Settings: undefined;
  Follow: { ids: number[] };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export type RoutesType = keyof RootStackParamList

export type DictResponseType = {
  word: string;
  phonetic: string;
  phonetics: {
    text: string;
    audio: string;
    sourceUrl: string;
    license: {
      name: string;
      url: string;
    };
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}[];
