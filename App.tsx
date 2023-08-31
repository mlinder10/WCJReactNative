import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";
import Search from "./pages/Search";
import User from "./pages/User";
import Account from "./pages/Account";
import Post from "./pages/Post";
import Signin from "./pages/Signin";
import AuthVerifier from "./contexts/AuthVerifier";
import { useState } from "react";
import { RootStackParamList } from "./types";
import AccountSettings from "./pages/AccountSettings";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [mounted, setMounted] = useState<boolean>(false);

  return (
    <NavigationContainer onReady={() => setMounted(true)}>
      <AuthVerifier mounted={mounted}>
        <Stack.Navigator
          initialRouteName="Signin"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name="Post"
            component={Post}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name="User"
            component={User}
            initialParams={{ id: 0 }}
          />
          <Stack.Screen
            name="Settings"
            component={AccountSettings}
            options={{ animation: "slide_from_left" }}
          />
        </Stack.Navigator>
      </AuthVerifier>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
