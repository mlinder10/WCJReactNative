import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthVerifier";
import { Ionicons } from "@expo/vector-icons";

type SignupProps = {
  togglePage: () => void;
};

export default function Signup({ togglePage }: SignupProps) {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  function handleSignup() {
    if (password !== confirmPassword) return;
    signup(username, password);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Ionicons name="person-circle" style={{ fontSize: 30 }} />
      <KeyboardAvoidingView style={styles.inputContainer}>
        <View>
          <TextInput
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.nativeEvent.text)}
            placeholder="Username"
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.nativeEvent.text)}
            placeholder="Password"
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
            placeholder="Confirm Password"
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.forwardBtnView}>
        <TouchableOpacity style={styles.forwardBtn} onPress={handleSignup}>
          <Ionicons name="arrow-forward" />
        </TouchableOpacity>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btnView} onPress={togglePage}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnView, { backgroundColor: "#eee" }]}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    paddingTop: 40,
    alignItems: "center",
    width: 250,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
    width: "50%",
  },
  input: {
    height: 30,
    borderBottomWidth: 1,
  },
  forwardBtnView: {
    width: "50%",
    marginBottom: 30,
    alignItems: "flex-start",
  },
  forwardBtn: {
    backgroundColor: "#eee",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  btnView: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
});
