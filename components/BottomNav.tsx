import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps, RoutesType } from "../types";
import { AuthContext } from "../contexts/AuthVerifier";
import { colors } from "../constants";

export default function BottomNav() {
  const navigation = useNavigation<NavigationProps>();
  const { user } = useContext(AuthContext);
  const route = useRoute();

  function handleNavigate(route: RoutesType) {
    if (route === "User") return;
    if (user !== null) navigation.replace(route);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => handleNavigate("Home")}
      >
        <View style={styles.btnView}>
          <Ionicons
            style={[
              styles.icon,
              {
                color:
                  route.name === "Home" ? colors.primary : colors.textSecondary,
              },
            ]}
            name="home"
          />
          <Text
            style={[
              styles.text,
              {
                color:
                  route.name === "Home" ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            Home
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => handleNavigate("Post")}
      >
        <View style={styles.btnView}>
          <Ionicons
            style={[
              styles.icon,
              {
                color:
                  route.name === "Post" ? colors.primary : colors.textSecondary,
              },
            ]}
            name="add-circle"
          />
          <Text
            style={[
              styles.text,
              {
                color:
                  route.name === "Post" ? colors.primary : colors.textSecondary,
              },
            ]}
          >
            Post
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => handleNavigate("Search")}
      >
        <View style={styles.btnView}>
          <Ionicons
            style={[
              styles.icon,
              {
                color:
                  route.name === "Search"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
            name="ios-search"
          />
          <Text
            style={[
              styles.text,
              {
                color:
                  route.name === "Search"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Search
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => handleNavigate("Account")}
      >
        <View style={styles.btnView}>
          <Ionicons
            style={[
              styles.icon,
              {
                color:
                  route.name === "Account"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
            name="person"
          />
          <Text
            style={[
              styles.text,
              {
                color:
                  route.name === "Account"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            Account
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopColor: colors.borderSecondary,
    borderTopWidth: 1,
    paddingVertical: 10,
    backgroundColor: colors.backgroundSecondary,
  },
  btnContainer: {
    flex: 1,
  },
  btnView: {
    alignItems: "center",
  },
  icon: {
    fontSize: 25,
    color: colors.text,
  },
  text: {
    color: colors.text,
    fontSize: 10,
  },
});
