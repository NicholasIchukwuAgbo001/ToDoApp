import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import { FlashMessageProvider } from "./src/context/FlashMessageContext";
import Auth from "./src/components/Auth";

export default function App() {
  return (
    <AuthProvider>
      <FlashMessageProvider>
        <Auth />
      </FlashMessageProvider>
    </AuthProvider>
  );
}
