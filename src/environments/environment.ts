// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'CaPMA Certification PME',
  features: {
    enableAnalytics: true,
    enableLogging: true,
    mockApi: true // Use mock services
  },
  payment: {
    mtnApiUrl: 'https://api.mtn.cm',
    orangeApiUrl: 'https://api.orange.com',
    bankApiUrl: 'https://api.bank.cm'
  }
};
