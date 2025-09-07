import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oauth2-code-pkce";
import App from "./App";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID;
const secret = import.meta.env.VITE_STRAVA_CLIENT_SECRET;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider
      authConfig={{
        clientId: clientId,
        authorizationEndpoint: "https://www.strava.com/oauth/authorize",
        tokenEndpoint: "https://www.strava.com/oauth/token",
        redirectUri: window.location.origin,
        scope: "read,activity:read_all",
        decodeToken: false,
        state: uuidv4(),
        responseType: "code",
        extraTokenParameters: {
          client_secret: secret,
          approval_prompt: "auto"
        },
        onAccessTokenExpiry: (refresh) => refresh(),
        onInvalidGrant: () => console.log("Invalid grant"),
      }}
    >
      <App />
    </AuthProvider>
  </React.StrictMode>
);