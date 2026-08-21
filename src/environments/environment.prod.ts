export const environment = {
  production: true,
  apiUrl: 'https://capma-server.onrender.com/api',
  appName: 'CaPMA Certification PME',
  features: {
    enableAnalytics: true,
    enableLogging: false,
    mockApi: false // Use real API
  },
  payment: {
    mtnApiUrl: 'https://api.mtn.cm',
    orangeApiUrl: 'https://api.orange.com',
    bankApiUrl: 'https://api.bank.cm'
  }
};
