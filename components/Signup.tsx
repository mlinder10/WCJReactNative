import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants";
import { AuthContext } from "../contexts/AuthVerifier";
import AlertPopup from "./AlertPopup";

type LoginProps = {
  togglePage: () => void;
};

export default function LoginPage({ togglePage }: LoginProps) {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");

  async function handleSignup() {
    let res = await signup(username, password, confirmPassword);
    setAlertMessage(res);
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Ionicons name="book-outline" size={80} color={colors.primary} />
          <Text style={styles.title}>Word Catching Journal</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={24}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Username"
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChange={(e) => setUsername(e.nativeEvent.text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChange={(e) => setPassword(e.nativeEvent.text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
            />
          </View>
          <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
            <Text style={styles.signupBtnText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.loginBtnText}>Already have an account? </Text>
            <TouchableOpacity onPress={togglePage}>
              <Text
                style={[
                  styles.loginBtnText,
                  { textDecorationLine: "underline" },
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      <AlertPopup
        message={alertMessage}
        clearMessage={() => setAlertMessage("")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.text,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "80%",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.borderSecondary,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: colors.text,
  },
  signupBtn: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    paddingVertical: 10,
    width: "80%",
    marginBottom: 20,
  },
  signupBtnText: {
    color: colors.background,
    fontSize: 16,
    textAlign: "center",
  },
  loginBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
