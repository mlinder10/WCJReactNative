import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthVerifier";
import { NavigationProps } from "../types";
import { useNavigation } from "@react-navigation/native";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function Signin() {
  const { user, mounted } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();
  const [page, setPage] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (!mounted) return;
    if (user !== null) navigation.replace("Home");
  }, [user, mounted]);

  function togglePage() {
    if (page === "login") setPage("signup");
    else setPage("login");
  }

  return (
    <>
      {page === "login" && <Login togglePage={togglePage} />}
      {page === "signup" && <Signup togglePage={togglePage} />}
    </>
  );
}
