import { View, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type ProfileImageProps = { uri: string; size: number };

export default function ProfileImage({ uri, size }: ProfileImageProps) {
  const [error, setError] = useState<boolean>(false);

  return (
    <View>
      {uri !== "" && !error ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size }}
          onError={() => setError(true)}
        />
      ) : (
        <Ionicons name="person-circle" style={{ fontSize: size }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
