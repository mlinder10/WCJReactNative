import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthVerifier";
import axios from "axios";
import { SERVER } from "../constants";
import BottomNav from "../components/BottomNav";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function Post() {
  const [word, setWord] = useState<string>("");
  const [def, setDef] = useState<string>("");
  const [defs, setDefs] = useState<string[] | "loading" | "error">([]);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [defType, setDefType] = useState<"search" | "custom">("search");
  const { user } = useContext(AuthContext);

  async function handleSearch() {
    setDefs("loading");
    try {
      let res = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      let definitions: string[] = [];
      res.data[0].meanings.forEach((m: any) => {
        m.definitions.forEach((d: any) => {
          definitions.push(d.definition);
        });
      });
      setDefs(definitions);
    } catch (err: any) {
      setDefs("error");
      console.log(err?.message);
    }
  }

  async function handlePost() {
    if (user === null || word === "" || def === "") return;
    try {
      await axios.post(`${SERVER}/posts`, {
        word,
        def,
        postedById: user.id,
        postedByUsername: user.uname,
        isPublic,
      });
      setWord("");
      setDef("");
      setDefs([]);
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  function checkForEnter(e: NativeSyntheticEvent<TextInputKeyPressEventData>) {
    if (e.nativeEvent.key === "Enter") handleSearch();
  }

  function toggleDefType() {
    if (defType === "custom") setDefType("search");
    else setDefType("custom");
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <View
          onTouchStart={() => Keyboard.dismiss()}
          style={styles.topContainer}
        >
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="search" style={{ fontSize: 16 }} />
            </TouchableOpacity>
            <TextInput
              onKeyPress={checkForEnter}
              style={styles.searchInput}
              value={word}
              onChange={(e) => setWord(e.nativeEvent.text)}
              placeholder="Word"
            />
          </View>
          <View style={styles.topBtnsContainer}>
            <TouchableOpacity style={styles.topBtn} onPress={toggleDefType}>
              <FontAwesome name={defType === "custom" ? "cog" : "search"} />
              <Text>{defType === "custom" ? "Custom" : "Search"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setIsPublic(!isPublic)}
            >
              <FontAwesome name={isPublic ? "globe" : "lock"} />
              <Text>{isPublic ? "Public" : "Private"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBtn} onPress={handlePost}>
              <Ionicons name="ios-arrow-up-circle" style={{ fontSize: 16 }} />
              <Text>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
        {defType === "search" ? (
          <ScrollView>
            {defs === "loading" && <Text>Loading...</Text>}
            {defs === "error" && <Text>Error Fetching Definitions</Text>}
            {defs !== "loading" && defs !== "error" && defs.length === 0 && (
              <View style={{ padding: 20 }}>
                <Text>Search A Word's Meaning</Text>
              </View>
            )}
            {defs !== "loading" &&
              defs !== "error" &&
              defs.map((d, i) => (
                <TouchableOpacity
                  style={[
                    styles.def,
                    { backgroundColor: def === d ? "#eee" : undefined },
                  ]}
                  key={i}
                  onPress={() => setDef(d)}
                >
                  <Text>{d}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : (
          <KeyboardAvoidingView style={styles.customContainer}>
            <TextInput
              style={{ height: "100%", lineHeight: 20 }}
              multiline={true}
              value={def}
              onChange={(e) => setDef(e.nativeEvent.text)}
              placeholder="Definition"
            />
          </KeyboardAvoidingView>
        )}
      </View>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    marginTop: 40,
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  searchContainer: {
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
  topBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  topBtn: {
    backgroundColor: "#ddd",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  def: {
    padding: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  customContainer: {
    flex: 1,
    padding: 20,
  },
});
