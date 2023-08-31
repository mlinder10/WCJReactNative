import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { AuthContext } from "../contexts/AuthVerifier";
import { NavigationProps, PostType } from "../types";
import axios from "axios";
import { SERVER } from "../constants";
import PostAccount from "../components/PostAccount";
import ProfileImage from "../components/ProfileImage";
import FollowModal from "../components/FollowModal";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Account() {
  const { user } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"following" | "followers">(
    "followers"
  );
  const [posts, setPosts] = useState<PostType[] | "loading" | "error">(
    "loading"
  );
  const navigation = useNavigation<NavigationProps>();

  async function getPosts() {
    if (user === null) return;
    try {
      let res = await axios.get(`${SERVER}/posts?type=own&userId=${user.id}`);
      setPosts(res.data.posts);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  function updatePosts(newPost?: PostType, id?: number) {
    if (posts === "loading" || posts === "error") return;
    if (newPost !== undefined) {
      let newPosts = [...posts];
      for (let p of newPosts) {
        if (p.id === newPost.id) p.likes = newPost.likes;
      }
      setPosts(newPosts);
    } else {
      let newPosts = [...posts];
      newPosts = newPosts.filter((p) => p.id !== id);
      setPosts(newPosts);
    }
  }

  function toggleModal(type?: "following" | "followers") {
    if (type === "followers" || type === "following") setModalType(type);
    setModalOpen(!modalOpen);
  }

  useEffect(() => {
    getPosts();
  }, [user]);

  if (user === null) return null;

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.imgContainer}
            onPress={() => navigation.navigate("Settings")}
          >
            <ProfileImage uri={user.profileimage} size={50} />
            <Text style={styles.uname}>{user.uname}</Text>
          </TouchableOpacity>
          <View style={styles.followContainer}>
            <TouchableOpacity
              onPress={() => toggleModal("followers")}
              style={styles.followView}
            >
              <Text>{user.followers.length}</Text>
              <Text>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleModal("following")}
              style={styles.followView}
            >
              <Text>{user.following.length}</Text>
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
              <PostAccount key={p.id} post={p} updatePosts={updatePosts} />
            ))}
        </ScrollView>
      </View>
      <FollowModal
        type={modalType}
        isOpen={modalOpen}
        close={toggleModal}
        userIds={user[modalType]}
      />
      <BottomNav />
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
    alignItems: "flex-end",
    gap: 20,
  },
  uname: {
    fontSize: 30,
    fontWeight: "bold",
  },
  followContainer: {
    flexDirection: "row",
    gap: 20,
  },
  followView: {
    alignItems: "center",
  },
});
