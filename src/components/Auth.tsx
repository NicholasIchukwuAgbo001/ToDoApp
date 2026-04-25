import React, { useState } from "react";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { useAuth } from "../context/AuthContext";
import TodoApp from "./TodoApp";

const Auth: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<"signin" | "signup">(
    "signin",
  );
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <TodoApp />;
  }

  if (currentScreen === "signin") {
    return (
      <SignInScreen onNavigateToSignUp={() => setCurrentScreen("signup")} />
    );
  }

  return <SignUpScreen onNavigateToSignIn={() => setCurrentScreen("signin")} />;
};

export default Auth;
