import React, { useRef } from "react";
import { View, TextInput } from "react-native";
import { styles } from "../../styles/authStyles";

const OTP_LENGTH = 4;

interface OtpInputProps {
    otp: string[];
    disabled: boolean;
    onChange: (otp: string[]) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ otp, disabled, onChange }) => {
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleChange = (value: string, index: number) => {
        // Handle paste of full code
        if (value.length > 1) {
            const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
            const next = [...otp];
            digits.forEach((d, i) => { if (index + i < OTP_LENGTH) next[index + i] = d; });
            onChange(next);
            inputRefs.current[Math.min(index + digits.length, OTP_LENGTH - 1)]?.focus();
            return;
        }
        const digit = value.replace(/\D/g, "");
        const next = [...otp];
        next[index] = digit;
        onChange(next);
        if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            const next = [...otp];
            next[index - 1] = "";
            onChange(next);
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.otpRow}>
            {otp.map((digit, i) => (
                <TextInput
                    key={i}
                    ref={(ref) => { inputRefs.current[i] = ref; }}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : undefined]}
                    value={digit}
                    onChangeText={(v) => handleChange(v, i)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                    keyboardType="number-pad"
                    maxLength={OTP_LENGTH}
                    selectTextOnFocus
                    editable={!disabled}
                    textContentType="oneTimeCode"
                />
            ))}
        </View>
    );
};

export default OtpInput;
