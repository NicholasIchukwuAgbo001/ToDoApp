import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useFlashMessage } from "../context/FlashMessageContext";
import { verifyEmail } from "../services/authService";
import { styles } from "../styles/authStyles";
import VerifyHeader from "../components/verify/VerifyHeader";
import OtpInput from "../components/verify/OtpInput";
import ResendCode from "../components/verify/ResendCode";

const OTP_LENGTH = 4;

interface VerifyEmailScreenProps {
    email: string;
    onVerified: () => void;
    onBack: () => void;
}

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ email, onVerified, onBack }) => {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const { showSuccess, showError } = useFlashMessage();

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length < OTP_LENGTH) {
            showError("Please enter the complete verification code");
            return;
        }

        setIsLoading(true);
        const result = await verifyEmail({ email, otp: code });
        setIsLoading(false);

        if (result.ok) {
            showSuccess(result.message || "Email verified successfully!");
            onVerified();
        } else {
            const errorMap: Record<number, string> = {
                400: "Invalid or expired code. Please try again.",
                404: "Account not found. Please register again.",
            };
            showError(errorMap[result.statusCode] ?? result.message);
            setOtp(Array(OTP_LENGTH).fill(""));
        }
    };

    const handleResend = () => {
        showError("Please go back and register again to resend the code.");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.content}>
                <VerifyHeader
                    email={email}
                    otpLength={OTP_LENGTH}
                    onBack={onBack}
                    disabled={isLoading}
                />

                <OtpInput otp={otp} disabled={isLoading} onChange={setOtp} />

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.disabledButton]}
                    onPress={handleVerify}
                    disabled={isLoading}
                    activeOpacity={0.7}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Verify Email</Text>
                    )}
                </TouchableOpacity>

                <ResendCode onResend={handleResend} disabled={isLoading} />
            </View>
        </KeyboardAvoidingView>
    );
};

export default VerifyEmailScreen;
