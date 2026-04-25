import { StyleSheet } from "react-native";
import { moderateScale, hp, wp } from "../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: hp(1.5),
    paddingBottom: hp(3),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1),
  },
  addButton: {
    backgroundColor: "#2196F3",
    borderRadius: moderateScale(30),
    padding: moderateScale(8),
    marginTop: -hp(3),
    elevation: 4,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: moderateScale(12),
    color: "#666",
    marginTop: hp(0.5),
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#2196F3",
    fontWeight: "600",
  },
});
