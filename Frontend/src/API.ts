const serverContext = "http://localhost:8080";

const api = {
  AUTH: {
    LOGIN: `${serverContext}/api/auth/login`,
    SESSION: `${serverContext}/api/auth/session`,
  },

  SECURITY_GROUP: {
    SCAN: `${serverContext}/security-groups/scan`,
    FINDINGS: `${serverContext}/accounts/security-groups`,
    REMEDIATION: `${serverContext}/accounts/security-groups/remediation`,
    HISTORY: `${serverContext}/accounts/history`,
  },
};

export default api;
