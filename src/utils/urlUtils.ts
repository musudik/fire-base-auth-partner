export const getVerificationParams = (url: string) => {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  
  return {
    mode: params.get('mode'),
    oobCode: params.get('oobCode'),
    apiKey: params.get('apiKey'),
    uid: params.get('uid')
  };
}; 