interface Environment {
  apiUrl: string;
  appUrl: string;
  isProduction: boolean;
}

const getEnvironment = (): Environment => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return {
      apiUrl: 'http://localhost:5001',
      appUrl: 'http://localhost:5001',
      isProduction: false
    };
  } else {
    return {
      apiUrl: 'https://gen-wealth-e6322.firebaseapp.com',
      appUrl: 'https://gen-wealth-e6322.firebaseapp.com',
      isProduction: true
    };
  }
};

export const environment = getEnvironment(); 