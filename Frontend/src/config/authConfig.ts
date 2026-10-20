const authMode = import.meta.env.VITE_AUTH_MODE;

export const isCognitoMode = authMode === "cognito";
export const isSessionMode = authMode === "session";
