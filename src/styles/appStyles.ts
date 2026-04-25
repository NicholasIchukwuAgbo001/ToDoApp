import { StyleSheet } from "react-native";
import { moderateScale, hp, wp, isTablet } from "../utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: isTablet ? wp(6) : wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp(2),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(3.5),
    borderRadius: moderateScale(12),
    fontSize: moderateScale(16),
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  listContainer: {
    flex: 1,
    paddingBottom: hp(12),
  },
  listContent: {
    paddingVertical: hp(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(8),
  },
  emptyText: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#666",
    marginTop: hp(2),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: "#999",
    marginTop: hp(1),
  },
});
