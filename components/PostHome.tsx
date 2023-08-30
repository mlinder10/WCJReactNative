import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import { NavigationProps, WordType } from "../types";
import { parseCreatedAt } from "../helpers";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthVerifier";
import axios from "axios";
import { SERVER } from "../constants";
import { useNavigation } from "@react-navigation/native";

type PostHomeProps = {
  post: WordType;
  updatePosts: (newPost: WordType) => void;
};

export default function PostHome({ post, updatePosts }: PostHomeProps) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();

  if (user === null) return null;

  async function likeWord() {
    if (user === null) return;
    try {
      let res = await axios.patch(`${SERVER}/words`, {
        wordId: post.id,
        userId: user.id,
      });
      updatePosts(res.data.word);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.word}>{post.word}</Text>
        <View>
          <Text>
            Posted by
            <Pressable
              onPress={() =>
                navigation.navigate("User", { id: post.postedbyid })
              }
            >
              <Text>{" " + post.postedbyusername + " "}</Text>
            </Pressable>
            at {parseCreatedAt(post.createdat)}
          </Text>
        </View>
      </View>
      <Text>{post.def}</Text>
      <TouchableOpacity style={styles.likeBtn} onPress={likeWord}>
        {post.likes.includes(user.id) ? (
          <Ionicons name="heart" style={{ color: "red" }} />
        ) : (
          <Ionicons name="heart-outline" />
        )}
        <Text>
          {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
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
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
