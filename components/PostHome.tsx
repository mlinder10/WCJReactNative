import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import { NavigationProps, PostType } from "../types";
import { parseCreatedAt } from "../helpers";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../contexts/AuthVerifier";
import axios from "axios";
import { API_KEY, SERVER, colors } from "../constants";
import { useNavigation } from "@react-navigation/native";

type PostHomeProps = {
  post: PostType;
  updatePosts: (newPost: PostType) => void;
};

export default function PostHome({ post, updatePosts }: PostHomeProps) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();

  if (user === null) return null;

  async function likeWord() {
    if (user === null) return;
    try {
      let res = await axios.patch(
        `${SERVER}/posts`,
        {
          postId: post.id,
          userId: user.id,
        },
        {
          headers: { "api-key": API_KEY },
        }
      );
      updatePosts(res.data.post);
    } catch (err: any) {}
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.word}>{post.word}</Text>
        <View>
          <Pressable
            onPress={() => navigation.navigate("User", { id: post.postedbyid })}
          >
            <Text style={{ color: colors.text }}>
              {post.postedbyusername +
                ", " +
                parseCreatedAt(post.createdat, "date")}
            </Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.def}>{post.def}</Text>
      <TouchableOpacity style={styles.likeBtn} onPress={likeWord}>
        {post.likes.includes(user.id) ? (
          <Ionicons name="heart" style={{ color: "red" }} />
        ) : (
          <Ionicons name="heart-outline" style={{ color: colors.text }} />
        )}
        <Text style={{ color: colors.text }}>
          {post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  word: {
    fontSize: 20,
    textTransform: "capitalize",
    color: colors.text,
  },
  def: {
    marginVertical: 10,
    color: colors.text,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
