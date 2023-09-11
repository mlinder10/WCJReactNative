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
import { colors, instance } from "../constants";
import PostAccount from "../components/PostAccount";
import ProfileImage from "../components/ProfileImage";
import { useNavigation } from "@react-navigation/native";
import LoadingWheel from "../components/LoadingWheel";

export default function Account() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostType[] | "loading" | "error">(
    "loading"
  );
  const navigation = useNavigation<NavigationProps>();

  async function getPosts() {
    if (user === null) return;
    try {
      let res = await instance.get(`/posts/own?id=${user.id}`);
      setPosts(res.data.posts);
    } catch (err: any) {
      setPosts("error");
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

  useEffect(() => {
    getPosts();
  }, [user]);

  if (user === null) return null;

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
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
              onPress={() =>
                navigation.navigate("Follow", {
                  type: "followers",
                  ids: user.followers,
                })
              }
              style={styles.followView}
            >
              <Text style={{ color: colors.text }}>
                {user.followers.length}
              </Text>
              <Text style={{ color: colors.text }}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Follow", {
                  type: "following",
                  ids: user.following,
                })
              }
              style={styles.followView}
            >
              <Text style={{ color: colors.text }}>
                {user.following.length}
              </Text>
              <Text style={{ color: colors.text }}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {posts === "loading" && <LoadingWheel topMargin />}
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
    paddingTop: 40,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSecondary,
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
    color: colors.text,
  },
  followContainer: {
    flexDirection: "row",
    gap: 20,
  },
  followView: {
    alignItems: "center",
  },
});
