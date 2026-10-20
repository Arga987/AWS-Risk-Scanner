import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { isCognitoMode } from "./config/authConfig.ts";
import { configureCognito } from "./config/cognitoConfig.ts";

if (isCognitoMode) {
  configureCognito();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
