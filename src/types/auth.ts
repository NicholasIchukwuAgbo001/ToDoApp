export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  roles: string[];
  activeRole: string;
  phone: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
