import { StyleSheet } from "react-native";
import { moderateScale, hp, wp, isTablet } from "../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    marginBottom: hp(1.5),
    marginHorizontal: isTablet ? wp(6) : wp(4),
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),
    borderRadius: moderateScale(12),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkbox: {
    marginRight: wp(3),
  },
  taskText: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#333",
    lineHeight: moderateScale(22),
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteButton: {
    padding: moderateScale(8),
    marginLeft: wp(2),
  },
});
