import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import * as Animatable from "react-native-animatable";
import { colors } from "../constants";

type LoadingWheelProps = {
  color?: string;
  size?: number;
  containerStyles?: {};
  topMargin?: boolean
};

export default function LoadingWheel({
  color = colors.text,
  size = 30,
  topMargin=false,
  containerStyles,
}: LoadingWheelProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: topMargin ? "40%": undefined,
        ...containerStyles,
      }}
    >
      <Animatable.View
        animation="rotate"
        easing="linear"
        iterationCount="infinite"
        duration={500}
        style={{ alignItems: "center" }}
      >
        <FontAwesome name="refresh" color={color} size={size} />
      </Animatable.View>
    </View>
  );
}
