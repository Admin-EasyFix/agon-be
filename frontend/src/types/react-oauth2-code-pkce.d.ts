declare module "react-oauth2-code-pkce" {
  import React from "react";

  export interface AuthProviderProps {
    authConfig: {
      clientId: string;
      authorizationEndpoint: string;
      tokenEndpoint: string;
      redirectUri: string;
      scope?: string;
      decodeToken?: boolean;
      responseType?: "code" | "token";
      state?: string;
      extraAuthParameters?: Record<string, string>;
      extraTokenParameters?: Record<string, string>;
      onAccessTokenExpiry?: (refresh: () => void) => void;
      onInvalidGrant?: () => void;
    };
    children: React.ReactNode;
  }

  export const AuthProvider: React.FC<AuthProviderProps>;

  export interface TokenData {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    scope: string;
    refreshToken?: string;
  }

export interface AuthContextType {
  token: string | null;                     // Access token (null if not logged in)
  idToken: string | null;                   // Optional OpenID token
  tokenData: Record<string, TokenData> | null;    // Decoded JWT payload (from access or id token)
  logIn: (extraParams?: Record<string, string>, state?: string, display?: "page" | "popup") => void;
  logOut: () => void;                       // Clears tokens & login state
  error: string | null;                     // Any error during login/refresh
  isLoggingIn: boolean;                     // True while the login flow is in progress
  isFetchingToken: boolean;                 // True while token exchange/refresh is happening
  tokenType: string | null;                 // e.g., "Bearer"
  expiresAt: number | null;                 // Epoch timestamp (ms) when token expires
  refreshToken: string | null;              // If supported by provider
}

  export const AuthContext: React.Context<AuthContextType>;
}