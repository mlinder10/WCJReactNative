import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProps, UserType, WordType } from "../types";
import axios from "axios";
import { SERVER } from "../constants";
import PostHome from "../components/PostHome";
import ProfileImage from "../components/ProfileImage";
import { useNavigation } from "@react-navigation/native";
import UserObject from "../components/UserObject";

export default function Search() {
  const [search, setSearch] = useState<string>("");
  const [searchType, setSearchType] = useState<"user" | "post">("user");
  const [users, setUsers] = useState<UserType[] | "loading" | "error">(
    "loading"
  );
  const [posts, setPosts] = useState<WordType[] | "loading" | "error">(
    "loading"
  );

  async function handleSearch() {
    if (searchType === "user") setUsers("loading");
    if (searchType === "post") setPosts("loading");
    try {
      let res = await axios.get(`${SERVER}/users?type=search&input=${search}`);
      setUsers(res.data.users);
      setPosts(res.data.words);
    } catch (err: any) {
      if (searchType === "user") setUsers("error");
      if (searchType === "post") setPosts("error");
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
    handleSearch();
  }, [search, searchType]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.topContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" style={{ fontSize: 16 }} />
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
                { backgroundColor: searchType === "user" ? "#ddd" : undefined },
              ]}
              onPress={() => setSearchType("user")}
            >
              <Text>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: searchType === "post" ? "#ddd" : undefined },
              ]}
              onPress={() => setSearchType("post")}
            >
              <Text>Posts</Text>
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
  posts: WordType[] | "loading" | "error";
  type: "user" | "post";
  updatePosts: (newPost: WordType) => void;
};

function SearchDisplay({
  users,
  posts,
  type,
  updatePosts,
}: SearchDisplayProps) {
  return (
    <ScrollView>
      {type === "user" && users === "loading" && <Text>Loading...</Text>}
      {type === "user" && users === "error" && (
        <Text>Error Fetching Users</Text>
      )}
      {type === "user" &&
        users !== "loading" &&
        users !== "error" &&
        users.map((u) => <UserObject key={u.id} user={u} />)}
      {type === "post" && posts === "loading" && <Text>Loading...</Text>}
      {type === "post" && posts === "error" && (
        <Text>Error Fetching Posts</Text>
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
    borderBottomColor: "#ccc",
    paddingTop: 40,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    height: 40,
    width: "60%",
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
