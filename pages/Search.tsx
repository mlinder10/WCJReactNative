import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { UserType, PostType } from "../types";
import axios from "axios";
import { API_KEY, SERVER, colors } from "../constants";
import PostHome from "../components/PostHome";
import UserObject from "../components/UserObject";
import LoadingWheel from "../components/LoadingWheel";

export default function Search() {
  const [search, setSearch] = useState<string>("");
  const [searchType, setSearchType] = useState<"user" | "post">("user");
  const [users, setUsers] = useState<UserType[] | "loading" | "error">(
    "loading"
  );
  const [posts, setPosts] = useState<PostType[] | "loading" | "error">(
    "loading"
  );

  async function handleSearch() {
    if (searchType === "user") setUsers("loading");
    if (searchType === "post") setPosts("loading");
    try {
      let res = await axios.get(`${SERVER}/users?type=search&input=${search}`, {
        headers: {"api-key": API_KEY}
      });
      setUsers(res.data.users);
      setPosts(res.data.words);
    } catch (err: any) {
      if (searchType === "user") setUsers("error");
      if (searchType === "post") setPosts("error");
    }
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
    handleSearch();
  }, [search, searchType]);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          onTouchStart={() => Keyboard.dismiss()}
          style={styles.topContainer}
        >
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              style={{ fontSize: 16, color: colors.text }}
            />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.nativeEvent.text)}
              placeholder="Search"
            />
          </View>
          <View style={styles.btnsContainer}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor:
                    searchType === "user" ? colors.border : undefined,
                },
              ]}
              onPress={() => setSearchType("user")}
            >
              <Text style={{ color: colors.text }}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor:
                    searchType === "post" ? colors.border : undefined,
                },
              ]}
              onPress={() => setSearchType("post")}
            >
              <Text style={{ color: colors.text }}>Posts</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SearchDisplay
          users={users}
          posts={posts}
          type={searchType}
          updatePosts={updatePosts}
        />
      </View>
      <BottomNav />
    </>
  );
}

type SearchDisplayProps = {
  users: UserType[] | "loading" | "error";
  posts: PostType[] | "loading" | "error";
  type: "user" | "post";
  updatePosts: (newPost: PostType) => void;
};

function SearchDisplay({
  users,
  posts,
  type,
  updatePosts,
}: SearchDisplayProps) {
  return (
    <ScrollView>
      {type === "user" && users === "loading" && <LoadingWheel topMargin />}
      {type === "user" && users === "error" && (
        <Text style={{ color: colors.text }}>Error Fetching Users</Text>
      )}
      {type === "user" &&
        users !== "loading" &&
        users !== "error" &&
        users.map((u) => <UserObject key={u.id} user={u} />)}
      {type === "post" && posts === "loading" && <LoadingWheel topMargin />}
      {type === "post" && posts === "error" && (
        <Text style={{ color: colors.text }}>Error Fetching Posts</Text>
      )}
      {type === "post" &&
        posts !== "loading" &&
        posts !== "error" &&
        posts.map((p) => (
          <PostHome key={p.id} post={p} updatePosts={updatePosts} />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSecondary,
    paddingTop: 40,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: colors.border,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    height: 40,
    width: "60%",
    color: colors.text,
  },
  btnsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  btn: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  userView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 40,
    justifyContent: "center",
  },
});
