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
          <Text style={styles.text}>Home</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={() => handleNavigate("Post")}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="add-circle" />
          <Text style={styles.text}>Post</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={() => handleNavigate("Search")}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="ios-search" />
          <Text style={styles.text}>Search</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={() => handleNavigate("Account")}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="person" />
          <Text style={styles.text}>Account</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnContainer} onPress={logout}>
        <View style={styles.btnView}>
          <Ionicons style={styles.icon} name="log-out" />
          <Text style={styles.text}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    paddingVertical: 10,
    backgroundColor: "#eee"
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
  text: {
    color: "#222",
    fontSize: 10
  }
});
