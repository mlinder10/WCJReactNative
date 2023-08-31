import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../contexts/AuthVerifier";
import ProfileImage from "../components/ProfileImage";
import { SERVER } from "../constants";
import axios from "axios";

type FileType = {
  uri: string;
  type: string;
  name: string;
};

export default function AccountSettings() {
  const navigation = useNavigation<NavigationProps>();
  const { user, logout } = useContext(AuthContext);
  const [file, setFile] = useState<any | null>(null);

  async function openImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      let newFile = {
        uri: result.assets[0].uri,
        type: `test/${result.assets[0].uri.split(".")[1]}`,
        name: `test.${result.assets[0].uri.split(".")[1]}`,
      };
      setFile(result.assets[0].uri);
    }
  }

  async function handleImageUpload() {
    if (user === null || file === null) return;
    try {
      let data = new FormData()
      data.append("file", (file))
      data.append("upload_preset", "kfffjhdp")
      data.append("cloud_name", "dfh4arkeh")
      let res = await axios.post(`https://api.cloudinary.com/v1_1/dfh4arkeh/image/upload`, data)
      console.log(res)
    } catch (err: any) {
      console.log(err.response.data.error);
    }
  }

  return (
    <View>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Account")}>
          <Ionicons name="arrow-back" style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out" style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <ProfileImage
          uri={file === null ? user?.profileimage ?? "" : file.uri}
          size={50}
        />
        <TouchableOpacity onPress={openImagePicker}>
          <Text>Pick Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImageUpload}>
          <Text>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#eee",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    padding: 20,
    paddingTop: 40,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  bottomContainer: {
    padding: 20,
  },
});
