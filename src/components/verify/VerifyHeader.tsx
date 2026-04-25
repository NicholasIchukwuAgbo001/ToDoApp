import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/authStyles";
import { moderateScale } from "../../utils/responsive";

interface VerifyHeaderProps {
    email: string;
    otpLength: number;
    onBack: () => void;
    disabled: boolean;
}

const maskEmail = (email: string) =>
    email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) =>
        a + "*".repeat(Math.max(b.length, 3)) + c,
    );

const VerifyHeader: React.FC<VerifyHeaderProps> = ({ email, otpLength, onBack, disabled }) => (
    <>
        <TouchableOpacity style={styles.backButton} onPress={onBack} disabled={disabled}>
            <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
            <Ionicons name="mail-open-outline" size={moderateScale(56)} color="#2196F3" />
        </View>

        <Text style={styles.verifyTitle}>Verify your email</Text>
        <Text style={styles.verifySubtitle}>
            We sent a {otpLength}-digit code to{"\n"}
            <Text style={styles.emailHighlight}>{maskEmail(email)}</Text>
        </Text>
    </>
);

export default VerifyHeader;
