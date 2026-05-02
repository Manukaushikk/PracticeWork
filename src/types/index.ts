export type Role = "admin" | "support" | "pharmacist";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  role: Role;
}

// Shape of the auth slice state
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  twoFactorPending: boolean;
}
