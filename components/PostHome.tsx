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
import { SERVER } from "../constants";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "./ProfileImage";

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
      let res = await axios.patch(`${SERVER}/posts`, {
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
          <Pressable
            onPress={() => navigation.navigate("User", { id: post.postedbyid })}
          >
            <Text>
              {post.postedbyusername + ", " + parseCreatedAt(post.createdat, "date")}
            </Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.def}>{post.def}</Text>
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
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
