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
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthVerifier";
import axios from "axios";
import { colors, instance } from "../constants";
import BottomNav from "../components/BottomNav";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import LoadingWheel from "../components/LoadingWheel";
import AlertPopup from "../components/AlertPopup";
import { DictResponseType } from "../types";

export default function Post() {
  const [word, setWord] = useState<string>("");
  const [def, setDef] = useState<string>("");
  const [defs, setDefs] = useState<string[] | "loading">([]);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [defType, setDefType] = useState<"search" | "custom">("search");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const { user } = useContext(AuthContext);

  async function handleSearch() {
    setDefs("loading");
    try {
      let { data }: { data: DictResponseType } = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      let definitions: string[] = [];
      data[0].meanings.forEach((m: any) => {
        m.definitions.forEach((d: any) => {
          definitions.push(d.definition);
        });
      });
      setDefs(definitions);
    } catch (err: any) {
      setAlertMessage(`No definitions found for \"${word}\"`);
      setDefs([]);
    }
  }

  async function handlePost() {
    if (user === null || word === "" || def === "") return;
    try {
      await instance.post(`/posts`, {
        word,
        def,
        postedById: user.id,
        postedByUsername: user.uname,
        isPublic,
      });
      setWord("");
      setDef("");
      setDefs([]);
      setAlertMessage("Posted successfully!");
    } catch (err: any) {
      setAlertMessage("Error posting");
      setWord("");
      setDef("");
      setDefs([]);
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
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          onTouchStart={() => Keyboard.dismiss()}
          style={styles.topContainer}
        >
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons
                name="search"
                style={{ fontSize: 16, color: colors.text }}
              />
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
              <FontAwesome
                name={defType === "custom" ? "cog" : "search"}
                style={{ color: colors.text }}
              />
              <Text style={{ color: colors.text }}>
                {defType === "custom" ? "Custom" : "Search"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topBtn}
              onPress={() => setIsPublic(!isPublic)}
            >
              <FontAwesome
                name={isPublic ? "globe" : "lock"}
                style={{ color: colors.text }}
              />
              <Text style={{ color: colors.text }}>
                {isPublic ? "Public" : "Private"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBtn} onPress={handlePost}>
              <Ionicons
                name="ios-arrow-up-circle"
                style={{ fontSize: 16, color: colors.text }}
              />
              <Text style={{ color: colors.text }}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
        {defType === "search" ? (
          <ScrollView>
            {defs === "loading" && <LoadingWheel topMargin />}
            {defs !== "loading" && defs.length === 0 && (
              <View style={{ padding: 20 }}>
                <Text style={{ color: colors.text }}>
                  Search A Word's Meaning
                </Text>
              </View>
            )}
            {defs !== "loading" &&
              defs.map((d, i) => (
                <TouchableOpacity
                  style={[
                    styles.def,
                    {
                      backgroundColor: def === d ? colors.border : undefined,
                    },
                  ]}
                  key={i}
                  onPress={() => setDef(d)}
                >
                  <Text style={{ color: colors.text }}>{d}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        ) : (
          <KeyboardAvoidingView style={styles.customContainer}>
            <TextInput
              style={{ height: "100%", lineHeight: 20, color: colors.text }}
              multiline={true}
              value={def}
              onChange={(e) => setDef(e.nativeEvent.text)}
              placeholder="Definition"
            />
          </KeyboardAvoidingView>
        )}
      </View>
      <AlertPopup
        message={alertMessage}
        clearMessage={() => setAlertMessage("")}
      />
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
    borderBottomColor: colors.border,
  },
  searchContainer: {
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
  topBtnsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  topBtn: {
    backgroundColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  def: {
    padding: 20,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  customContainer: {
    flex: 1,
    padding: 20,
  },
});
