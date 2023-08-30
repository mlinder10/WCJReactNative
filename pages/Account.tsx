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
import { WordType } from "../types";
import axios from "axios";
import { SERVER } from "../constants";
import PostAccount from "../components/PostAccount";
import ProfileImage from "../components/ProfileImage";

export default function Account() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<WordType[] | "loading" | "error">(
    "loading"
  );

  async function getPosts() {
    if (user === null) return;
    try {
      let res = await axios.get(`${SERVER}/words?type=own&userId=${user.id}`);
      setPosts(res.data.posts);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  function updatePosts(newPost?: WordType, id?: number) {
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

  useEffect(() => {
    getPosts();
  }, [user]);

  if (user === null) return null;

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.topContainer}>
          <View style={styles.imgContainer}>
            <ProfileImage user={user} size={50} />
            <Text style={styles.uname}>{user.uname}</Text>
          </View>
          <View style={styles.followContainer}>
            <TouchableOpacity style={styles.followView}>
              <Text>{user.followers.length}</Text>
              <Text>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followView}>
              <Text>{user.following.length}</Text>
              <Text>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.postsContainer}>
          {posts === "loading" && <Text>Loading...</Text>}
          {posts === "error" && <Text>Error Fetching Posts</Text>}
          {posts !== "loading" &&
            posts !== "error" &&
            posts.map((p) => (
              <PostAccount key={p.id} post={p} updatePosts={updatePosts} />
            ))}
        </ScrollView>
      </View>
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
    paddingTop: 20,
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
