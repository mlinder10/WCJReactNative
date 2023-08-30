import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthVerifier";
import axios from "axios";
import { SERVER } from "../constants";
import BottomNav from "../components/BottomNav";

export default function Post() {
  const [word, setWord] = useState<string>("");
  const [def, setDef] = useState<string>("");
  const [defs, setDefs] = useState<string[]>([]);
  const { user } = useContext(AuthContext);

  async function handleSearch() {
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
      console.log(err?.message);
    }
  }

  async function handlePost() {
    if (user === null || word === "" || def === "") return;
    try {
      await axios.post(`${SERVER}/words`, {
        word,
        def,
        postedById: user.id,
        postedByUsername: user.uname,
      });
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.topContainer}>
          <TextInput
            value={word}
            onChange={(e) => setWord(e.nativeEvent.text)}
            placeholder="Word"
          />
          <TouchableOpacity onPress={handleSearch}>
            <Text>Search</Text>
          </TouchableOpacity>
          <TextInput
            value={def}
            onChange={(e) => setDef(e.nativeEvent.text)}
            placeholder="Definition"
          />
          <TouchableOpacity onPress={handlePost}>
            <Text>Post</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {defs.length === 0 && <Text>Search A Word's Meaning</Text>}
          {defs.map((d, i) => (
            <View key={i}>
              <Text>{d}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <BottomNav />
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    marginTop: 40,
  },
});
