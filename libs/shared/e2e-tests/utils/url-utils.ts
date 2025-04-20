export const joinUrl = (baseURL: string, path?: string) => {
  if (!path) return baseURL;
  const baseUrl = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  const uri = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}${uri}`;
};
