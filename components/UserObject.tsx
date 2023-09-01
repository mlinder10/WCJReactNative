import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import ProfileImage from "./ProfileImage";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps, UserType } from "../types";
import { colors } from "../constants";

type UserObjectProps = { user: UserType };

export default function UserObject({ user }: UserObjectProps) {
  const navigation = useNavigation<NavigationProps>();

  return (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => navigation.navigate("User", { id: user.id })}
    >
      <View style={styles.leftContainer}>
        <ProfileImage uri={user.profileimage} size={30} />
        <Text style={styles.uname}>{user.uname}</Text>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.followContainer}>
          <Text style={styles.followText}>{user.followers.length}</Text>
          <Text style={styles.followText}>Followers</Text>
        </View>
        <View style={styles.followContainer}>
          <Text style={styles.followText}>{user.following.length}</Text>
          <Text style={styles.followText}>Following</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSecondary,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  uname: {
    fontSize: 16,
    color: colors.text
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  followContainer: {
    alignItems: "center",
  },
  followText: {
    fontSize: 12,
    color: colors.text
  },
});
