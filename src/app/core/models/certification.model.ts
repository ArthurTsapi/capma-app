/**
 * Certification Level Model
 * Defines the structure of certification levels offered by CaPMA
 */
export interface CertificationLevel {
  id: 'foundation' | 'practitioner' | 'professional' | 'master';
  title: string;
  subtitle: string;
  totalFee: number; // en FCFA
  registrationFee: number;
  examFee: number;
  targetPublic: string;
  minimumEducation: string;
  experienceYears: number;
  experienceHours?: number; // Pour Professional et Master
  prerequisites: string[];
  features: string[];
  highlights?: string[];
  isPopular?: boolean;
  examDetails: {
    durationMinutes: number;
    questionCount?: number;
    examType: string;
    passingScore: number; // pourcentage
  };
  color?: 'blue' | 'orange' | 'green' | 'gray';
  badge?: string; // ex: "Le plus choisi"
}

/**
 * Candidate Application Model
 * Tracks the application status and documents of a candidate
 */
export interface CandidateApplication {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  preferredCenterId: string;
  selectedLevelId: string;
  status: ApplicationStatus;
  documents: CandidateDocuments;
  appliedAt: Date;
  validatedAt?: Date;
  paymentStatus: PaymentStatus;
  convocationUrl?: string;
  examScore?: number;
  certificateUrl?: string;
}

export type ApplicationStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'paid' 
  | 'convoked' 
  | 'exam_completed' 
  | 'certified'
  | 'rejected';

export interface CandidateDocuments {
  cvUrl?: string;
  diplomaUrl?: string;
  idCardUrl?: string;
  experienceCertUrl?: string;
  uploadedAt: Date;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PaymentMethod {
  id: 'mtn' | 'orange' | 'bank';
  label: string;
  description: string;
  icon?: string;
}

/**
 * Authorized Center Model
 * Represents a CaPMA authorized exam center
 */
export interface AuthorizedCenter {
  id: string;
  city: string;
  location: string;
  address: string;
  phoneNumber: string;
  features: {
    hasComputerLab: boolean;
    hasStableInternet: boolean;
    hasCctv: boolean;
    seatCapacity?: number;
  };
  schedule?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
  };
}

/**
 * Certification Step Model
 * Represents a step in the certification process
 */
export interface CertificationStep {
  id: number;
  key: 'submission' | 'review' | 'validation' | 'payment' | 'convocation' | 'exam' | 'certificate';
  title: string;
  description: string;
  estimatedDuration?: string; // ex: "5 jours"
  icon?: string;
}

/**
 * User Authentication Model
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'candidate' | 'admin' | 'reviewer';
  createdAt: Date;
  lastLogin?: Date;
}

/**
 * Exam Simulator Model
 */
export interface ExamSimulator {
  id: string;
  levelId: string;
  title: string;
  description: string;
  questions: ExamQuestion[];
  durationMinutes: number;
  passingScore: number;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  category?: string;
}

export interface ExamResult {
  id: string;
  candidateId: string;
  examId: string;
  score: number;
  maxScore: number;
  percentageScore: number;
  passed: boolean;
  completedAt: Date;
  responses: ExamResponse[];
}

export interface ExamResponse {
  questionId: string;
  selectedAnswerIndex: number;
  isCorrect: boolean;
}
