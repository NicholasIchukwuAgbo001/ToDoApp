import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const wp = (percent: number) => (SCREEN_WIDTH * percent) / 100;
export const hp = (percent: number) => (SCREEN_HEIGHT * percent) / 100;

export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH >= 768;
