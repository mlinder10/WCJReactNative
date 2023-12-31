import { useEffect, useState } from "react";
import { UserType } from "../types";
import { instance } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAuth() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    getLocalUser();
  }, []);

  async function getLocalUser() {
    let storedUser = await AsyncStorage.getItem("wcj-local");
    if (storedUser === null) return;
    let tempUser: UserType | null = JSON.parse(storedUser);
    if (tempUser !== null) {
      login(tempUser.uname, tempUser.password);
    }
  }

  async function signup(
    username: string,
    password: string,
    confirmPassword: string
  ) {
    if (username === "" && password === "" && confirmPassword === "")
      return "empty uname and pass and confirm";
    if (username === "" && confirmPassword === "")
      return "empty uname and confirm";
    if (confirmPassword === "" && password === "")
      return "empty pass and confirm";
    if (username === "" && password === "") return "empty uname and pass";
    if (username === "") return "empty uname";
    if (password === "") return "empty pass";
    if (confirmPassword === "") return "empty confirm";

    try {
      let res = await instance.post(`/auth`, {
        uname: username,
        password,
      });
      if (res.data.user !== null) {
        updateUser(res.data.user);
        return "";
      }
      return "null user";
    } catch (err: any) {
      return err.response.data.message;
    }
  }

  async function login(username: string, password: string) {
    if (username === "" && password === "") return "empty uname and pass";
    if (username === "") return "empty uname";
    if (password === "") return "empty pass";

    try {
      let res = await instance.get(
        `/auth?uname=${username}&password=${password}`
      );
      if (res.data.user !== null) {
        updateUser(res.data.user);
        return "";
      }
      return "null user";
    } catch (err: any) {
      return err.response.data.message;
    }
  }

  async function logout() {
    await AsyncStorage.setItem("wcj-local", JSON.stringify(null));
    setUser(null);
  }

  async function updateUser(newUser: UserType | null) {
    if (newUser !== null) {
      setUser(newUser);
      await AsyncStorage.setItem("wcj-local", JSON.stringify(newUser));
    }
  }

  return { user, signup, login, logout, updateUser };
}
