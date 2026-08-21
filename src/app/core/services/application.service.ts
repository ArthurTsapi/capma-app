import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CandidateApplication, ApplicationStatus } from '../models/certification.model';

/**
 * Service to manage candidate applications
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private applicationsSubject = new BehaviorSubject<CandidateApplication[]>([]);
  
  // Mock data for demonstration
  private mockApplications: CandidateApplication[] = [
    {
      id: 'app-001',
      userId: 'user-001',
      firstName: 'Jean-Pierre',
      lastName: 'Mballa',
      email: 'jean.mballa@email.cm',
      phone: '+237 6 00 00 00 00',
      city: 'Douala',
      preferredCenterId: 'center-douala',
      selectedLevelId: 'practitioner',
      status: 'under_review',
      documents: {
        uploadedAt: new Date()
      },
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      paymentStatus: 'pending'
    },
    {
      id: 'app-demo',
      userId: 'user-demo',
      firstName: 'Demo',
      lastName: 'Candidat',
      email: 'demo@capma.cm',
      phone: '+237 6 11 00 00 00',
      city: 'Yaoundé',
      preferredCenterId: 'center-yaounde',
      selectedLevelId: 'practitioner',
      status: 'paid',
      documents: {
        cvUrl: 'https://capma.cm/docs/app-demo/cv.pdf',
        diplomaUrl: 'https://capma.cm/docs/app-demo/diploma.pdf',
        idCardUrl: 'https://capma.cm/docs/app-demo/id-card.pdf',
        experienceCertUrl: 'https://capma.cm/docs/app-demo/experience.pdf',
        uploadedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      validatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      paymentStatus: 'completed',
      convocationUrl: 'https://capma.cm/convocation/app-demo.pdf'
    }
  ];

  constructor() {
    this.applicationsSubject.next(this.mockApplications);
  }

  /**
   * Get all applications
   */
  getApplications(): Observable<CandidateApplication[]> {
    return this.applicationsSubject.asObservable();
  }

  /**
   * Get application by id
   */
  getApplicationById(id: string): Observable<CandidateApplication | undefined> {
    return new Observable(observer => {
      const app = this.mockApplications.find(a => a.id === id);
      observer.next(app);
      observer.complete();
    });
  }

  /**
   * Get applications for a specific user
   */
  getUserApplications(userId: string): Observable<CandidateApplication[]> {
    return new Observable(observer => {
      const apps = this.mockApplications.filter(a => a.userId === userId);
      observer.next(apps);
      observer.complete();
    });
  }

  /**
   * Get applications by candidate email
   */
  getApplicationsByEmail(email: string): Observable<CandidateApplication[]> {
    return new Observable(observer => {
      const normalized = (email || '').toLowerCase().trim();
      const apps = this.mockApplications.filter(a => (a.email || '').toLowerCase().trim() === normalized);
      observer.next(apps);
      observer.complete();
    });
  }

  /**
   * Get most recent application for a candidate email
   */
  getLatestApplicationByEmail(email: string): Observable<CandidateApplication | undefined> {
    return new Observable(observer => {
      const normalized = (email || '').toLowerCase().trim();
      const apps = this.mockApplications
        .filter(a => (a.email || '').toLowerCase().trim() === normalized)
        .sort((a, b) => (b.appliedAt?.getTime() || 0) - (a.appliedAt?.getTime() || 0));
      observer.next(apps[0]);
      observer.complete();
    });
  }

  /**
   * Get all applications synchronously (for UI checks)
   */
  getAllApplicationsSync(): CandidateApplication[] {
    return [...this.mockApplications];
  }

  /**
   * Get application by email synchronously (for UI checks)
   */
  getLatestApplicationByEmailSync(email: string): CandidateApplication | undefined {
    const normalized = (email || '').toLowerCase().trim();
    const apps = this.mockApplications
      .filter(a => (a.email || '').toLowerCase().trim() === normalized)
      .sort((a, b) => (b.appliedAt?.getTime() || 0) - (a.appliedAt?.getTime() || 0));
    return apps[0];
  }

  /**
   * Create a new application
   */
  createApplication(application: Omit<CandidateApplication, 'id'>): Observable<CandidateApplication> {
    return new Observable(observer => {
      const newApp: CandidateApplication = {
        ...application,
        id: 'app-' + Date.now()
      };
      this.mockApplications.push(newApp);
      this.applicationsSubject.next([...this.mockApplications]);
      observer.next(newApp);
      observer.complete();
    });
  }

  /**
   * Update application status
   */
  updateApplicationStatus(id: string, status: ApplicationStatus): Observable<CandidateApplication | null> {
    return new Observable(observer => {
      const app = this.mockApplications.find(a => a.id === id);
      if (app) {
        app.status = status;
        if (status === 'approved') {
          app.validatedAt = new Date();
        }
        this.applicationsSubject.next([...this.mockApplications]);
        observer.next(app);
      } else {
        observer.next(null);
      }
      observer.complete();
    });
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(id: string, paymentStatus: 'pending' | 'processing' | 'completed' | 'failed'): Observable<CandidateApplication | null> {
    return new Observable(observer => {
      const app = this.mockApplications.find(a => a.id === id);
      if (app) {
        app.paymentStatus = paymentStatus;
        if (paymentStatus === 'completed') {
          app.status = 'paid';
          app.convocationUrl = `https://capma.cm/convocation/${app.id}.pdf`;
        }
        this.applicationsSubject.next([...this.mockApplications]);
        observer.next(app);
      } else {
        observer.next(null);
      }
      observer.complete();
    });
  }

  /**
   * Upload document
   */
  uploadDocument(applicationId: string, documentType: 'cv' | 'diploma' | 'idCard' | 'experienceCert', file: File): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      // Simulate file upload
      const app = this.mockApplications.find(a => a.id === applicationId);
      if (app) {
        if (documentType === 'cv') {
          app.documents.cvUrl = `https://capma.cm/docs/${applicationId}/cv.pdf`;
        } else if (documentType === 'diploma') {
          app.documents.diplomaUrl = `https://capma.cm/docs/${applicationId}/diploma.pdf`;
        } else if (documentType === 'idCard') {
          app.documents.idCardUrl = `https://capma.cm/docs/${applicationId}/id.pdf`;
        } else if (documentType === 'experienceCert') {
          app.documents.experienceCertUrl = `https://capma.cm/docs/${applicationId}/experience.pdf`;
        }
        this.applicationsSubject.next([...this.mockApplications]);
        observer.next({ success: true, message: 'Document uploaded successfully' });
      } else {
        observer.next({ success: false, message: 'Application not found' });
      }
      observer.complete();
    });
  }

  /**
   * Get application status color
   */
  getStatusColor(status: ApplicationStatus): string {
    switch (status) {
      case 'submitted':
      case 'approved':
      case 'certified':
        return 'bg-green-100 text-green-800';
      case 'under_review':
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'convoked':
      case 'exam_completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get application status label
   */
  getStatusLabel(status: ApplicationStatus): string {
    const labels: Record<ApplicationStatus, string> = {
      submitted: 'Soumis',
      under_review: 'En cours de validation',
      approved: 'Approuvé',
      paid: 'Payé',
      convoked: 'Convoqué',
      exam_completed: 'Examen terminé',
      certified: 'Certifié',
      rejected: 'Rejeté'
    };
    return labels[status];
  }
}
