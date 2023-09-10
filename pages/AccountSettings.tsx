import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "../types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../contexts/AuthVerifier";
import ProfileImage from "../components/ProfileImage";
import { API_KEY, SERVER, colors, instance } from "../constants";

type FileType = {
  uri: string;
  type: string;
  name: string;
};

export default function AccountSettings() {
  const navigation = useNavigation<NavigationProps>();
  const { user, logout } = useContext(AuthContext);
  const [file, setFile] = useState<FileType | null>(null);

  async function openImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      let filename = uri.split("/").pop();
      let match = /\.(\w+)$/.exec(filename ?? "");
      let type = match ? `image/${match[1]}` : `image`;
      setFile({ uri, type, name: filename ?? "" });
    }
  }

  async function handleImageUpload() {
    if (user === null || file === null) return;
    try {
      let res = await FileSystem.uploadAsync(
        `${SERVER}/images?filename=${user.id}`,
        file.uri,
        {
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "image",
          mimeType: `image/${file.type}`,
          headers: { "api-key": API_KEY },
        }
      );
      console.log(res);
    } catch (err: any) {}
  }

  async function handleDeleteProfile() {
    if (user === null) return;
    try {
      await instance.delete(`/users?type=one&id=${user.id}`);
      logout();
    } catch (err: any) {}
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Account")}>
          <Ionicons
            name="arrow-back"
            style={{ fontSize: 30, color: colors.text }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Ionicons
            name="log-out"
            style={{ fontSize: 30, color: colors.text }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <ProfileImage uri={file?.uri ?? user?.profileimage ?? ""} size={50} />
        <View>
          <TouchableOpacity onPress={openImagePicker}>
            <Text style={{ color: colors.text }}>Pick Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImageUpload}>
            <Text style={{ color: colors.text }}>Upload</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={{ color: colors.text }}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    padding: 20,
    paddingTop: 40,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  bottomContainer: {
    padding: 20,
    flexDirection: "row",
    gap: 20,
  },
});
