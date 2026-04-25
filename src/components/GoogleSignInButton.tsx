import React, { useCallback } from "react";
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    View,
    StyleSheet,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { moderateScale, hp, wp } from "../utils/responsive";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com";
const GOOGLE_ANDROID_CLIENT_ID = "YOUR_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com";

interface GoogleSignInButtonProps {
    onToken: (idToken: string) => Promise<void>;
    disabled?: boolean;
}

// Google "G" logo using pure Views — no external assets or SVG needed
const GoogleIcon: React.FC = () => {
    const size = moderateScale(20);
    const half = size / 2;
    const stroke = size * 0.15;
    const innerSize = size - stroke * 2;

    return (
        <View style={{ width: size, height: size }}>
            {/* Four color quadrants */}
            <View style={{ position: "absolute", top: 0, left: 0, width: half, height: half, backgroundColor: "#4285F4", borderTopLeftRadius: half }} />
            <View style={{ position: "absolute", top: 0, right: 0, width: half, height: half, backgroundColor: "#34A853", borderTopRightRadius: half }} />
            <View style={{ position: "absolute", bottom: 0, left: 0, width: half, height: half, backgroundColor: "#EA4335", borderBottomLeftRadius: half }} />
            <View style={{ position: "absolute", bottom: 0, right: 0, width: half, height: half, backgroundColor: "#FBBC05", borderBottomRightRadius: half }} />
            {/* White inner circle to form the ring */}
            <View style={{
                position: "absolute",
                top: stroke,
                left: stroke,
                width: innerSize,
                height: innerSize,
                borderRadius: innerSize / 2,
                backgroundColor: "#fff",
            }} />
            {/* Blue crossbar for the "G" */}
            <View style={{
                position: "absolute",
                top: half - stroke * 0.65,
                left: half,
                right: stroke,
                height: stroke * 1.3,
                backgroundColor: "#4285F4",
            }} />
        </View>
    );
};

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onToken, disabled }) => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        redirectUri: makeRedirectUri({ scheme: "taskly" }),
    });

    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            if (id_token) {
                setIsLoading(true);
                onToken(id_token).finally(() => setIsLoading(false));
            }
        }
    }, [response]);

    const handlePress = useCallback(async () => {
        await promptAsync();
    }, [promptAsync]);

    const busy = isLoading || !request;

    return (
        <TouchableOpacity
            style={[styles.button, busy && styles.disabled]}
            onPress={handlePress}
            disabled={busy || disabled}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color="#444" size="small" />
            ) : (
                <>
                    <GoogleIcon />
                    <Text style={styles.text}>Continue with Google</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: moderateScale(12),
        borderWidth: 1,
        borderColor: "#E0E0E0",
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        gap: wp(2),
    },
    text: {
        fontSize: moderateScale(16),
        fontWeight: "600",
        color: "#444",
    },
    disabled: {
        opacity: 0.5,
    },
});

export default GoogleSignInButton;
