import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/authStyles";

interface ResendCodeProps {
    onResend: () => void;
    disabled: boolean;
}

const ResendCode: React.FC<ResendCodeProps> = ({ onResend, disabled }) => {
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const canResend = countdown <= 0 && !disabled;

    return (
        <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={canResend ? onResend : undefined} disabled={!canResend}>
                <Text style={[styles.resendLink, !canResend && styles.resendDisabled]}>
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ResendCode;
