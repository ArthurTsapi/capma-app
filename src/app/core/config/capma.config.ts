// Configuration files for CaPMA Application

/**
 * CaPMA Application Configuration
 * Contains all configurable settings for the application
 */
export const capmaConfig = {
  // Application Identity
  app: {
    name: 'CaPMA Certification PME',
    version: '1.0.0',
    description: 'Plateforme SaaS de certification professionnelle en gestion de projet',
    author: 'Cameroon Project Management Association'
  },

  // Organization Details
  organization: {
    name: 'Cameroon Project Management Association',
    shortName: 'CaPMA',
    email: 'contact@capma.cm',
    phone: '+237 6 00 00 00 00',
    website: 'https://www.capma.cm',
    logo: '/assets/capma-logo.jpeg'
  },

  // Certification Levels Configuration
  certifications: {
    foundation: {
      maxApplications: 500,
      applicationFee: 10000,
      examFee: 50000,
      examDuration: 90,
      passingScore: 70
    },
    practitioner: {
      maxApplications: 300,
      applicationFee: 15000,
      examFee: 100000,
      examDuration: 180,
      passingScore: 75
    },
    professional: {
      maxApplications: 100,
      applicationFee: 30000,
      examFee: 170000,
      examDuration: 240,
      passingScore: 80
    },
    master: {
      maxApplications: 30,
      applicationFee: 50000,
      examFee: 350000,
      examDuration: 190,
      passingScore: 85
    }
  },

  // Exam Centers
  centers: [
    {
      id: 'center-douala',
      city: 'Douala',
      region: 'Littoral',
      location: 'Akwa'
    },
    {
      id: 'center-yaounde',
      city: 'Yaoundé',
      region: 'Centre',
      location: 'Centre-ville'
    },
    {
      id: 'center-bafoussam',
      city: 'Bafoussam',
      region: 'Ouest',
      location: 'Marché A'
    },
    {
      id: 'center-garoua',
      city: 'Garoua',
      region: 'Nord',
      location: 'Roumdé Adjia'
    }
  ],

  // Application Process Timeline
  timeline: {
    applicationReviewDays: 5,
    paymentDays: 2,
    convocationIssuedDays: 1,
    certificateIssuedDays: 7
  },

  // Payment Methods
  paymentMethods: [
    {
      id: 'mtn',
      name: 'MTN MoMo',
      icon: 'mtn-icon',
      description: 'Mobile Money MTN Cameroon',
      enabled: true
    },
    {
      id: 'orange',
      name: 'Orange Money',
      icon: 'orange-icon',
      description: 'Orange Money Cameroon',
      enabled: true
    },
    {
      id: 'bank',
      name: 'Virement Bancaire',
      icon: 'bank-icon',
      description: 'Transfert bancaire direct',
      enabled: true
    }
  ],

  // Email Configuration
  email: {
    from: 'noreply@capma.cm',
    support: 'support@capma.cm',
    admin: 'admin@capma.cm',
    templates: {
      confirmationApplication: 'application-confirmation',
      validationApproved: 'validation-approved',
      paymentReminder: 'payment-reminder',
      convocationSent: 'convocation-sent',
      resultNotification: 'result-notification',
      certificateIssued: 'certificate-issued'
    }
  },

  // Security Configuration
  security: {
    tokenExpiryMinutes: 60,
    refreshTokenExpiryDays: 30,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    passwordRequireNumber: true,
    passwordRequireUpperCase: true,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15
  },

  // Feature Flags
  features: {
    enableRegistration: true,
    enablePasswordReset: true,
    enableExamSimulator: true,
    enablePaymentGateway: true,
    enableEmailNotifications: true,
    enableSMSNotifications: true,
    enableCertificateDownload: true,
    enableExamResit: true
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50]
  },

  // Validation Rules
  validation: {
    phonePattern: /^\+237\s?[2-9]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    nameMinLength: 2,
    nameMaxLength: 50,
    cityMinLength: 2,
    cityMaxLength: 50
  }
};
