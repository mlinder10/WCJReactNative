import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthVerifier";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps, RootStackParamList, WordType } from "../types";
import axios from "axios";
import { SERVER } from "../constants";
import BottomNav from "../components/BottomNav";
import PostHome from "../components/PostHome";

export default function Home() {
  const { user, mounted } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();
  const [postType, setPostType] = useState<"recent" | "following">("recent");
  const [posts, setPosts] = useState<WordType[] | "loading" | "error">(
    "loading"
  );

  async function getPosts() {
    if (user === null) return;

    try {
      if (postType === "recent") {
        let res = await axios.get(`${SERVER}/words?type=recent`);
        setPosts(res.data.posts);
      } else {
        let res = await axios.get(
          `${SERVER}/words?type=following&ids=${JSON.stringify(user.following)}`
        );
        setPosts(res.data.posts);
      }
    } catch (err: any) {
      setPosts("error");
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
    if (!mounted) return;
    if (user === null) navigation.replace("Signin");
  }, [user, mounted]);

  useEffect(() => {
    setPosts("loading");
    getPosts();
  }, [user, postType]);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.postContainer}
        stickyHeaderHiddenOnScroll
        stickyHeaderIndices={[0]}
      >
        <View>
          <View style={styles.btnsContainer}>
            <TouchableOpacity
              style={[
                styles.btnView,
                { backgroundColor: postType === "recent" ? "#ddd" : undefined },
              ]}
              onPress={() => setPostType("recent")}
            >
              <Text>Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btnView,
                {
                  backgroundColor:
                    postType === "following" ? "#ddd" : undefined,
                },
              ]}
              onPress={() => setPostType("following")}
            >
              <Text>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  postContainer: {
    gap: 30,
  },
  btnsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  btnView: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20
  },
});
