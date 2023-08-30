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
import PostUser from "../components/PostUser";
import { AuthContext } from "../contexts/AuthVerifier";
import ProfileImage from "../components/ProfileImage";

export default function User({
  route,
}: {
  route: RouteProp<RootStackParamList, "User">;
}) {
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

  useEffect(() => {
    setPosts("loading");
    getPosts();
  }, [userData]);

  if (userData === null) return null;

  return (
    <View>
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
          <TouchableOpacity style={styles.followView}>
            <Text>{userData.followers.length}</Text>
            <Text>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followView}>
            <Text>{userData.following.length}</Text>
            <Text>Following</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.postsContainer}>
        {posts === "loading" && <Text>Loading...</Text>}
        {posts === "error" && <Text>Error Fetching Posts</Text>}
        {posts !== "loading" &&
          posts !== "error" &&
          posts.map((p) => (
            <PostUser key={p.id} post={p} updatePosts={updatePosts} />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
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
    gap: 60,
  },
  followView: {
    alignItems: "center",
  },
  postsContainer: {
    paddingTop: 60,
    gap: 30,
  },
});
