import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthVerifier";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps, RootStackParamList, PostType } from "../types";
import axios from "axios";
import { SERVER, colors } from "../constants";
import BottomNav from "../components/BottomNav";
import PostHome from "../components/PostHome";

export default function Home() {
  const { user, mounted } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();
  const [postType, setPostType] = useState<"recent" | "following">("recent");
  const [posts, setPosts] = useState<PostType[] | "loading" | "error">(
    "loading"
  );
  const scrollViewRef = useRef<ScrollView>(null);

  async function getPosts() {
    if (user === null) return;

    try {
      if (postType === "recent") {
        let res = await axios.get(`${SERVER}/posts?type=recent`);
        setPosts(res.data.posts);
      } else {
        let res = await axios.get(
          `${SERVER}/posts?type=following&ids=${JSON.stringify(user.following)}`
        );
        setPosts(res.data.posts);
      }
    } catch (err: any) {
      setPosts("error");
    }
  }

  function togglePostType(type: "recent" | "following") {
    if (type !== postType) return setPostType(type);
    getPosts();
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  function updatePosts(newPost: PostType) {
    if (posts === "loading" || posts === "error") return;
    let newPosts = [...posts];
    for (let p of newPosts) {
      if (p.id === newPost.id) p.likes = newPost.likes;
    }
    setPosts(newPosts);
  }

  useEffect(() => {
    if (!mounted) return;
    if (user === null) navigation.replace("Signin");
  }, [user, mounted]);

  useEffect(() => {
    setPosts("loading");
    getPosts();
  }, [user, postType]);

  return (
    <>
      <View style={styles.btnsContainer}>
        <TouchableOpacity
          style={styles.btnView}
          onPress={() => togglePostType("recent")}
        >
          <View
            style={[
              styles.btnText,
              {
                borderBottomColor:
                  postType === "recent" ? colors.primary : "transparent",
              },
            ]}
          >
            <Text style={{color: colors.text}}>Recent</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnView}
          onPress={() => togglePostType("following")}
        >
          <View
            style={[
              styles.btnText,
              {
                borderBottomColor:
                  postType === "following" ? colors.primary : "transparent",
              },
            ]}
          >
            <Text style={{color: colors.text}}>Following</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={{backgroundColor: colors.background}} ref={scrollViewRef}>
        {posts === "loading" && <Text>Loading...</Text>}
        {posts === "error" && <Text>Error Fetching Posts</Text>}
        {posts !== "loading" &&
          posts !== "error" &&
          posts.map((p) => (
            <PostHome key={p.id} post={p} updatePosts={updatePosts} />
          ))}
      </ScrollView>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  btnsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomColor: colors.borderSecondary,
    borderBottomWidth: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  btnView: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  btnText: {
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
});
