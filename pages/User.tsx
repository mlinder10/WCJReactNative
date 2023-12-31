import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { RouteProp, useNavigation } from "@react-navigation/native";
import {
  NavigationProps,
  RootStackParamList,
  UserType,
  PostType,
} from "../types";
import { colors, instance } from "../constants";
import { AuthContext } from "../contexts/AuthVerifier";
import ProfileImage from "../components/ProfileImage";
import PostHome from "../components/PostHome";
import LoadingWheel from "../components/LoadingWheel";

type UserProps = {
  route: RouteProp<RootStackParamList, "User">;
};

export default function User({ route }: UserProps) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();

  if (user !== null && id === user.id) navigation.navigate("Account");

  const [userData, setUserData] = useState<UserType | "loading" | "error">(
    "loading"
  );

  async function getUserData() {
    try {
      let res = await instance.get(`/users/profile?id=${id}`);
      setUserData(res.data.user);
    } catch (err: any) {
      setUserData("error");
    }
  }

  function updateUserData(newUser: UserType) {
    if (newUser === null) return;
    setUserData(newUser);
  }

  useEffect(() => {
    getUserData();
  }, [id]);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {userData === "loading" && <LoadingWheel />}
        {userData === "error" && (
          <Text style={{ color: colors.text }}>Error Fetching Data</Text>
        )}
        {userData !== "loading" && userData !== "error" && (
          <UserBody userData={userData} updateUserData={updateUserData} />
        )}
      </View>
      <BottomNav />
    </>
  );
}

type UserBodyProps = {
  userData: UserType;
  updateUserData: (newUser: UserType) => void;
};

function UserBody({ userData, updateUserData }: UserBodyProps) {
  const { user, updateUser } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostType[] | "loading" | "error">(
    "loading"
  );
  const navigation = useNavigation<NavigationProps>();

  async function handleFollow() {
    if (user === null) return;
    try {
      let res = await instance.patch(`/users`, {
        followerId: user.id,
        followingId: userData.id,
      });
      updateUser(res.data.newFollower);
      updateUserData(res.data.newFollowing);
    } catch (err: any) {}
  }

  async function getPosts() {
    if (userData === null) return;
    try {
      let res = await instance.get(`/posts/user?id=${userData.id}`);
      setPosts(res.data.posts);
    } catch (err: any) {
      setPosts("error");
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
    setPosts("loading");
    getPosts();
  }, [userData]);

  if (userData === null) return null;

  return (
    <>
      <View style={styles.topContainer}>
        <View>
          <View style={styles.imgContainer}>
            <ProfileImage uri={userData.profileimage} size={30} />
            <Text style={styles.uname}>{userData.uname}</Text>
          </View>
          <TouchableOpacity style={styles.followBtn} onPress={handleFollow}>
            <Text style={{ color: colors.background }}>
              {userData.followers.includes(user?.id ?? 0)
                ? "Following"
                : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.followContainer}>
          <TouchableOpacity
            style={styles.followView}
            onPress={() =>
              navigation.navigate("Follow", {
                ids: userData.followers,
              })
            }
          >
            <Text style={{ color: colors.text }}>
              {userData.followers.length}
            </Text>
            <Text style={{ color: colors.text }}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.followView}
            onPress={() =>
              navigation.navigate("Follow", {
                ids: userData.following,
              })
            }
          >
            <Text style={{ color: colors.text }}>
              {userData.following.length}
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
            <PostHome key={p.id} post={p} updatePosts={updatePosts} />
          ))}
      </ScrollView>
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
    alignItems: "center",
    gap: 20,
  },
  uname: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.text,
  },
  followBtn: {
    backgroundColor: colors.primary,
    alignItems: "center",
    marginTop: 10,
    borderRadius: 5,
    paddingVertical: 5,
    width: 100,
  },
  followContainer: {
    flexDirection: "row",
    gap: 20,
  },
  followView: {
    alignItems: "center",
  },
});
