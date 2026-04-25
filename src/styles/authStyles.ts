import { StyleSheet } from "react-native";
import { moderateScale, hp, wp, isTablet } from "../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: isTablet ? wp(20) : wp(6),
    paddingVertical: hp(3),
  },
  logo: {
    fontSize: moderateScale(32),
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: "#666",
    textAlign: "center",
    marginBottom: hp(4),
  },
  form: {
    marginBottom: hp(3),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: hp(2),
    paddingHorizontal: wp(3),
  },
  inputIcon: {
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    paddingVertical: hp(1.8),
    fontSize: moderateScale(16),
    color: "#333",
  },
  eyeIcon: {
    padding: moderateScale(4),
    marginLeft: wp(1),
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: hp(2),
    borderRadius: moderateScale(12),
    alignItems: "center",
    elevation: 3,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(18),
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },
  footerText: {
    color: "#666",
    fontSize: moderateScale(14),
  },
  footerLink: {
    color: "#2196F3",
    fontSize: moderateScale(14),
    fontWeight: "600",
    marginLeft: wp(1),
  },
  errorText: {
    color: "#FF5252",
    fontSize: moderateScale(14),
    marginBottom: hp(2),
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },

  // ── Verify Email ────────────────────────────────────────────────────────
  backButton: {
    position: "absolute",
    top: hp(6),
    left: wp(6),
    padding: moderateScale(4),
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: hp(3),
  },
  verifyTitle: {
    fontSize: moderateScale(26),
    fontWeight: "bold",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: hp(1.5),
  },
  verifySubtitle: {
    fontSize: moderateScale(15),
    color: "#666",
    textAlign: "center",
    lineHeight: moderateScale(22),
    marginBottom: hp(4),
  },
  emailHighlight: {
    color: "#2196F3",
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(3),
    marginBottom: hp(4),
  },
  otpBox: {
    width: moderateScale(58),
    height: moderateScale(62),
    borderRadius: moderateScale(12),
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: moderateScale(24),
    fontWeight: "700",
    color: "#1A1A1A",
  },
  otpBoxFilled: {
    borderColor: "#2196F3",
    backgroundColor: "#EBF5FF",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(1),
  },
  resendText: {
    color: "#666",
    fontSize: moderateScale(14),
  },
  resendLink: {
    color: "#2196F3",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  resendDisabled: {
    color: "#AAA",
  },
});
