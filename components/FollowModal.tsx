import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { UserType } from "../types";
import { useEffect, useState } from "react";
import { colors, instance } from "../constants";
import UserObject from "./UserObject";
import LoadingWheel from "./LoadingWheel";

type FollowModalProps = {
  type: "following" | "followers";
  isOpen: boolean;
  close: () => void;
  userIds: number[];
};

export default function FollowModal({
  type,
  isOpen,
  close,
  userIds,
}: FollowModalProps) {
  const [users, setUsers] = useState<UserType[] | "loading" | "error">(
    "loading"
  );

  async function getUsers() {
    try {
      let res = await instance.get(
        `/users/follow&ids=${JSON.stringify(userIds)}`
      );
      setUsers(res.data.users);
    } catch (err: any) {
      setUsers("error");
    }
  }

  useEffect(() => {
    setUsers("loading");
    getUsers();
  }, [userIds, type]);

  return (
    <Modal
      isVisible={isOpen}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      hideModalContentWhileAnimating={true}
      style={styles.modal}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={close}>
          <Ionicons
            name="arrow-down"
            style={{ fontSize: 16, color: colors.text }}
          />
        </TouchableOpacity>
        <ScrollView style={{ width: "100%", height: "100%" }}>
          {users === "loading" && <LoadingWheel topMargin />}
          {users === "error" && <Text>Error Fetching Users</Text>}
          {users !== "loading" &&
            users !== "error" &&
            users.map((u) => <UserObject user={u} key={u.id} />)}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.background,
    margin: 0,
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
  },
  btn: {
    backgroundColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  container: {
    paddingTop: 40,
    alignItems: "center",
  },
});
