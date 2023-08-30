import { View, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { UserType } from "../types";
import { Ionicons } from "@expo/vector-icons";

type ProfileImageProps = { user: UserType; size: number };

export default function ProfileImage({ user, size }: ProfileImageProps) {
  const [error, setError] = useState<boolean>(false);

  return (
    <View>
      {user.profileimage !== "" && !error ? (
        <Image
          source={{ uri: user.profileimage }}
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
