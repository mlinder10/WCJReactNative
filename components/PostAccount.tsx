import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { PostType } from "../types";
import { parseCreatedAt } from "../helpers";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthVerifier";
import { SERVER } from "../constants";
import axios from "axios";

type PostAccountProps = {
  post: PostType;
  updatePosts: (newPost?: PostType, id?: number) => void;
};

export default function PostAccount({ post, updatePosts }: PostAccountProps) {
  const { user } = useContext(AuthContext);

  if (user === null) return null;

  async function likeWord() {
    if (user === null) return;
    try {
      let res = await axios.patch(`${SERVER}/posts`, {
        wordId: post.id,
        userId: user.id,
      });
      updatePosts(res.data.word);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  async function deletePost() {
    try {
      await axios.delete(`${SERVER}/posts?type=one&postId=${post.id}`);
      updatePosts(undefined, post.id);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.word}>{post.word}</Text>
        <Text>{parseCreatedAt(post.createdat)}</Text>
      </View>
      <View>
        <Text style={styles.def}>{post.def}</Text>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.btn} onPress={likeWord}>
            {post.likes.includes(user.id) ? (
              <Ionicons name="heart" style={{ color: "red" }} />
            ) : (
              <Ionicons name="heart-outline" />
            )}
            <Text>
              {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
            </Text>
          </TouchableOpacity>
          {!post.ispublic && (
            <View style={styles.privateTag}>
              <Text>Private</Text>
            </View>
          )}
          <TouchableOpacity style={styles.btn} onPress={deletePost}>
            <Ionicons name="trash" />
            <Text>Delete Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  topContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  word: {
    fontSize: 20,
    textTransform: "capitalize",
  },
  def: {
    marginVertical: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  privateTag: {
    backgroundColor: "#ddd",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});
