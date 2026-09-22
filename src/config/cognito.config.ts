function trimEnv(value?: string): string {
  return (value ?? '').trim();
}

function resolveCognitoRegion(userPoolId: string, explicitRegion: string): string {
  const poolRegion = userPoolId.split('_')[0];
  if (poolRegion && /^[a-z]{2}-[a-z]+-\d+$/.test(poolRegion)) {
    return poolRegion;
  }

  return explicitRegion || 'sa-east-1';
}

export default () => {
  const userPoolId = trimEnv(process.env.COGNITO_USER_POOL_ID);
  const clientId = trimEnv(process.env.COGNITO_CLIENT_ID);
  const configured = Boolean(userPoolId && clientId);
  const explicitRegion = trimEnv(process.env.COGNITO_REGION);

  return {
    cognito: {
      // Mock só quando pool/client não estão configurados
      mock: !configured,
      region: resolveCognitoRegion(userPoolId, explicitRegion),
      userPoolId,
      clientId,
      adminGroup: trimEnv(process.env.COGNITO_ADMIN_GROUP) || 'admin',
      configured,
    },
  };
};
