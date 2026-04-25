import React, { useState } from "react";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import VerifyEmailScreen from "../screens/VerifyEmailScreen";
import { useAuth } from "../context/AuthContext";
import TodoApp from "./TodoApp";

type Screen = "signin" | "signup" | "verify";

const Auth: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("signin");
  const [pendingEmail, setPendingEmail] = useState("");
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <TodoApp />;

  if (currentScreen === "signin") {
    return <SignInScreen onNavigateToSignUp={() => setCurrentScreen("signup")} />;
  }

  if (currentScreen === "verify") {
    return (
      <VerifyEmailScreen
        email={pendingEmail}
        onVerified={() => setCurrentScreen("signin")}
        onBack={() => setCurrentScreen("signup")}
      />
    );
  }

  return (
    <SignUpScreen
      onNavigateToSignIn={() => setCurrentScreen("signin")}
      onRegistered={(email) => {
        setPendingEmail(email);
        setCurrentScreen("verify");
      }}
    />
  );
};

export default Auth;
