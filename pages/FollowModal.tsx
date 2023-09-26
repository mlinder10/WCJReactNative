import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { NavigationProps, RootStackParamList, UserType } from "../types";
import { colors, instance } from "../constants";
import LoadingWheel from "../components/LoadingWheel";
import UserObject from "../components/UserObject";
import { RouteProp, useNavigation } from "@react-navigation/native";

type FollowModalProps = {
  route: RouteProp<RootStackParamList, "Follow">;
};

export default function FollowModal({ route }: FollowModalProps) {
  const [users, setUsers] = useState<UserType[] | "loading" | "error">(
    "loading"
  );
  const navigation = useNavigation<NavigationProps>();

  async function getUsers() {
    try {
      let res = await instance.get(
        `/users/follow?ids=${JSON.stringify(route.params.ids)}`
      );
      setUsers(res.data.users);
    } catch (err: any) {
      setUsers("error");
    }
  }

  useEffect(() => {
    setUsers("loading");
    getUsers();
  }, [route.params.ids]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.btn} onPress={() => navigation.goBack()}>
        <View style={styles.line}></View>
      </Pressable>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        {users === "loading" && <LoadingWheel topMargin />}
        {users === "error" && <Text>Error Fetching Users</Text>}
        {users !== "loading" &&
          users !== "error" &&
          users.map((u) => <UserObject user={u} key={u.id} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 5,
    marginBottom: 20,
    width: "100%",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: "10%",
    backgroundColor: colors.text,
    height: 2,
  },
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
});
