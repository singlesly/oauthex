export const clientCredentialsFromHeader = (
  header?: string,
): { clientId: string; clientSecret: string } => {
  const clientCredentials = header ? header.split(' ')[1] : '';
  const [clientId, clientSecret = ''] = Buffer.from(clientCredentials, 'base64')
    .toString('utf8')
    .split(':');

  return { clientId, clientSecret };
};
