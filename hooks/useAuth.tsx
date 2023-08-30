import axios from "axios";
import { useEffect, useState } from "react";
import { UserType } from "../types";
import { SERVER } from "../constants";
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

  async function signup(username: string, password: string) {
    try {
      let res = await axios.post(`${SERVER}/users`, {
        uname: username,
        password,
      });
      if (res.data.user !== null) updateUser(res.data.user);
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  async function login(username: string, password: string) {
    try {
      let res = await axios.get(
        `${SERVER}/users?type=login&uname=${username}&password=${password}`
      );
      if (res.data.user !== null) updateUser(res.data.user);
    } catch (err: any) {
      console.error(err?.message);
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
