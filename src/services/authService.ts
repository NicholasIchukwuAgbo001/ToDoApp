import { api, ApiError } from "./api";
import { User } from "../types/auth";

// ── Register ────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: { userId: string; email: string };
  timestamp: string;
}

export type RegisterResult =
  | { ok: true; data: RegisterResponse["data"]; message: string }
  | { ok: false; message: string; statusCode: number };

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResult> {
  try {
    const res = await api.post<RegisterResponse>("/auth/register", payload);
    return { ok: true, data: res.data, message: res.message };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: err.message, statusCode: err.statusCode };
    }
    return { ok: false, message: "Network error. Please check your connection.", statusCode: 0 };
  }
}

// ── Login ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
  timestamp: string;
}

export type LoginResult =
  | { ok: true; user: User; accessToken: string; refreshToken: string }
  | { ok: false; message: string; statusCode: number };

export async function loginUser(payload: LoginPayload): Promise<LoginResult> {
  try {
    const res = await api.post<LoginResponse>("/auth/login", payload);
    const { user, accessToken, refreshToken } = res.data;
    return { ok: true, user, accessToken, refreshToken };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: err.message, statusCode: err.statusCode };
    }
    return { ok: false, message: "Network error. Please check your connection.", statusCode: 0 };
  }
}

// ── Verify Email ─────────────────────────────────────────────────────────────

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: unknown;
  timestamp: string;
}

export type VerifyEmailResult =
  | { ok: true; message: string }
  | { ok: false; message: string; statusCode: number };

export async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResult> {
  try {
    const res = await api.post<VerifyEmailResponse>("/auth/verify-email", payload);
    return { ok: true, message: res.message };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: err.message, statusCode: err.statusCode };
    }
    return { ok: false, message: "Network error. Please check your connection.", statusCode: 0 };
  }
}

// ── Google Sign-In ────────────────────────────────────────────────────────────

export type GoogleSignInResult =
  | { ok: true; user: User; accessToken: string; refreshToken: string }
  | { ok: false; message: string; statusCode: number };

export async function googleSignIn(idToken: string): Promise<GoogleSignInResult> {
  try {
    const res = await api.post<{ success: boolean; message: string; data: LoginResponseData; timestamp: string }>(
      "/auth/google/verify",
      { idToken },
    );
    const { user, accessToken, refreshToken } = res.data;
    return { ok: true, user, accessToken, refreshToken };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, message: err.message, statusCode: err.statusCode };
    }
    return { ok: false, message: "Network error. Please check your connection.", statusCode: 0 };
  }
}
