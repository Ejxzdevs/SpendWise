// types/auth.ts

// --------------------
// API TYPES
// --------------------

export interface UserPayload {
  username: string;
  password: string;
}
// Response type for login
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

// Response type for registration
export type RegisterResponse =
  | {
      success: true;
      message: string;
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
  login: (
    token: string,
    user: { id: string; username: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
}
