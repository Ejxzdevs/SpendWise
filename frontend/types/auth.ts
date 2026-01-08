// types/auth.ts

// --------------------
// API TYPES
// --------------------

export interface LoginPayload {
  username: string;
  password: string;
}

export type LoginResponse =
  | {
      success: true;
      token: string;
      user: {
        id: string;
        username: string;
      };
    }
  | {
      success: false;
      message: string;
    };

// --------------------
// CONTEXT TYPES
// --------------------

export interface AuthContextType {
  userToken: string | null;
  username: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}
