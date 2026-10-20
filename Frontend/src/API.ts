const serverContext = import.meta.env.VITE_API_BASE_URL;

const api = {
  AUTH: {
    LOGIN: `${serverContext}/api/auth/login`,
    SESSION: `${serverContext}/api/auth/session`,
    CSRF: `${serverContext}/api/auth/csrf`,
  },

  SECURITY_GROUP: {
    SCAN: `${serverContext}/security-groups/scan`,
    FINDINGS: `${serverContext}/accounts/security-groups`,
    REMEDIATION: `${serverContext}/accounts/security-groups/remediation`,
    HISTORY: `${serverContext}/accounts/history`,
  },
};

export default api;
