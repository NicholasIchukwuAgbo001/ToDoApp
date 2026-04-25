import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import FlashMessage, { FlashMessageType } from "../components/FlashMessage";

interface FlashMessageContextType {
  showMessage: (message: string, type: FlashMessageType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const FlashMessageContext = createContext<FlashMessageContextType | undefined>(
  undefined,
);

interface FlashMessageProviderProps {
  children: ReactNode;
}

export const FlashMessageProvider: React.FC<FlashMessageProviderProps> = ({
  children,
}) => {
  const [currentMessage, setCurrentMessage] = useState<{
    id: number;
    message: string;
    type: FlashMessageType;
  } | null>(null);

  const showMessage = useCallback((message: string, type: FlashMessageType) => {
    setCurrentMessage({
      id: Date.now(),
      message,
      type,
    });
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showMessage(message, "success");
    },
    [showMessage],
  );

  const showError = useCallback(
    (message: string) => {
      showMessage(message, "danger");
    },
    [showMessage],
  );

  const hideMessage = useCallback(() => {
    setCurrentMessage(null);
  }, []);

  return (
    <FlashMessageContext.Provider
      value={{ showMessage, showSuccess, showError }}
    >
      {children}
      <FlashMessage message={currentMessage} onHide={hideMessage} />
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = (): FlashMessageContextType => {
  const context = useContext(FlashMessageContext);
  if (!context) {
    throw new Error(
      "useFlashMessage must be used within a FlashMessageProvider",
    );
  }
  return context;
};
