const serverContext = "http://localhost:8080";

const api = {
  SECURITY_GROUP: {
    SCAN: `${serverContext}/security-groups/scan`,
    FINDINGS: `${serverContext}/accounts/security-groups`,
    REMEDIATION: `${serverContext}/accounts/security-groups/remediation`,
  },
};

export default api;
