import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
  NavigationProps,
  RootStackParamList,
  UserType,
  WordType,
} from "../types";
import axios from "axios";
import { SERVER } from "../constants";
import { AuthContext } from "../contexts/AuthVerifier";
import ProfileImage from "../components/ProfileImage";
import PostHome from "../components/PostHome";
import FollowModal from "../components/FollowModal";

type UserProps = {
  route: RouteProp<RootStackParamList, "User">;
};

export default function User({ route }: UserProps) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();

  if (user !== null && id === user.id) navigation.navigate("Account");

  const [userData, setUserData] = useState<UserType | "loading" | "error">(
    "loading"
  );

  async function getUserData() {
    try {
      let res = await axios.get(`${SERVER}/users?type=profile&userId=${id}`);
      setUserData(res.data.user);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  function updateUserData(newUser: UserType) {
    if (newUser === null) return;
    setUserData(newUser);
  }

  useEffect(() => {
    getUserData();
  }, [id]);

  return (
    <>
      <View style={{ flex: 1 }}>
        {userData === "loading" && <Text>Loading...</Text>}
        {userData === "error" && <Text>Error Fetching Data</Text>}
        {userData !== "loading" && userData !== "error" && (
          <UserBody userData={userData} updateUserData={updateUserData} />
        )}
      </View>
      <BottomNav />
    </>
  );
}

type UserBodyProps = {
  userData: UserType;
  updateUserData: (newUser: UserType) => void;
};

function UserBody({ userData, updateUserData }: UserBodyProps) {
  const { user, updateUser } = useContext(AuthContext);
  const [posts, setPosts] = useState<WordType[] | "loading" | "error">(
    "loading"
  );
  const [modalType, setModalType] = useState<"following" | "followers">(
    "followers"
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  async function handleFollow() {
    if (user === null) return;
    try {
      let res = await axios.patch(`${SERVER}/users`, {
        followerId: user.id,
        followingId: userData.id,
      });
      updateUser(res.data.newFollower);
      updateUserData(res.data.newFollowing);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  async function getPosts() {
    if (userData === null) return;
    try {
      let res = await axios.get(
        `${SERVER}/words?type=own&userId=${userData.id}`
      );
      setPosts(res.data.posts);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  function updatePosts(newPost: WordType) {
    if (posts === "loading" || posts === "error") return;
    let newPosts = [...posts];
    for (let p of newPosts) {
      if (p.id === newPost.id) p.likes = newPost.likes;
    }
    setPosts(newPosts);
  }

  function toggleModal(type?: "following" | "followers") {
    if (type === "followers" || type === "following") setModalType(type);
    setModalOpen(!modalOpen);
  }

  useEffect(() => {
    setPosts("loading");
    getPosts();
  }, [userData]);

  if (userData === null) return null;

  return (
    <>
      <View style={styles.topContainer}>
        <View>
          <View style={styles.imgContainer}>
            <ProfileImage user={userData} size={30} />
            <Text style={styles.uname}>{userData.uname}</Text>
          </View>
          <TouchableOpacity style={styles.followBtn} onPress={handleFollow}>
            <Text>
              {userData.followers.includes(user?.id ?? 0)
                ? "Following"
                : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.followContainer}>
          <TouchableOpacity
            style={styles.followView}
            onPress={() => toggleModal("followers")}
          >
            <Text>{userData.followers.length}</Text>
            <Text>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.followView}
            onPress={() => toggleModal("following")}
          >
            <Text>{userData.following.length}</Text>
            <Text>Following</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {posts === "loading" && <Text>Loading...</Text>}
        {posts === "error" && <Text>Error Fetching Posts</Text>}
        {posts !== "loading" &&
          posts !== "error" &&
          posts.map((p) => (
            <PostHome key={p.id} post={p} updatePosts={updatePosts} />
          ))}
      </ScrollView>
      <FollowModal
        type={modalType}
        userIds={userData[modalType]}
        isOpen={modalOpen}
        close={toggleModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 20,
  },
  imgContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  uname: {
    fontSize: 30,
    fontWeight: "bold",
  },
  followBtn: {
    backgroundColor: "#ddd",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 5,
    paddingVertical: 5,
  },
  followContainer: {
    flexDirection: "row",
    gap: 20,
  },
  followView: {
    alignItems: "center",
  },
});
