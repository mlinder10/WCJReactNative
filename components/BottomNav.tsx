import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps, RoutesType } from "../types";
import { AuthContext } from "../contexts/AuthVerifier";

export default function BottomNav() {
  const navigation = useNavigation<NavigationProps>();
  const { user, logout } = useContext(AuthContext);

  function handleNavigate(route: RoutesType) {
    if (route === "User") return;
    if (user !== null) navigation.navigate(route);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnContainer} onPress={() => handleNavigate("Home")}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="home" />
          <Text>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={() => handleNavigate("Post")}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="add-circle" />
          <Text>Post</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={() => handleNavigate("Search")}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="ios-search" />
          <Text>Search</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={() => handleNavigate("Account")}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="person" />
          <Text>Account</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={logout}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="log-out" />
          <Text>Log Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopColor: "black",
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  btnContainer: {
    flex: 1
  },
  btnView: {
    alignItems: "center",
  },
  icon: {
    fontSize: 25,
  },
});
