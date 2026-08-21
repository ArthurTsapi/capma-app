import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { CandidateApplication, ApplicationStatus } from '../models/certification.model';
import { environment } from '../../../environments/environment';

/**
 * Service to manage candidate applications
 */
@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly apiBase = environment.apiUrl;
  
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

  constructor(private http: HttpClient) {
  }

  /**
   * Get all applications
   */
  getApplications(): Observable<CandidateApplication[]> {
    return this.http.get<{ success: boolean; data: CandidateApplication[] }>(`${this.apiBase}/applications`)
      .pipe(map(response => response.data || []));
  }

  /**
   * Get application by id
   */
  getApplicationById(id: string): Observable<CandidateApplication | undefined> {
    return this.http.get<{ success: boolean; data: CandidateApplication }>(`${this.apiBase}/applications/${encodeURIComponent(id)}`)
      .pipe(map(response => response.data));
  }

  /**
   * Get applications for a specific user
   */
  getUserApplications(userId: string): Observable<CandidateApplication[]> {
    return this.http.get<{ success: boolean; data: CandidateApplication[] }>(`${this.apiBase}/applications`, { params: { userId } })
      .pipe(map(response => response.data || []));
  }

  /**
   * Get applications by candidate email
   */
  getApplicationsByEmail(email: string): Observable<CandidateApplication[]> {
    return this.http.get<{ success: boolean; data: CandidateApplication[] }>(
      `${this.apiBase}/applications/by-email/${encodeURIComponent(email.trim().toLowerCase())}`
    ).pipe(map(response => response.data || []));
  }

  /**
   * Get most recent application for a candidate email
   */
  getLatestApplicationByEmail(email: string): Observable<CandidateApplication | undefined> {
    return this.http.get<{ success: boolean; data: CandidateApplication | null }>(
      `${this.apiBase}/applications/latest-by-email/${encodeURIComponent(email.trim().toLowerCase())}`
    ).pipe(map(response => response.data || undefined));
  }

  /**
   * Get all applications synchronously (for UI checks)
   */
  getAllApplicationsSync(): CandidateApplication[] {
    return [];
  }

  /**
   * Get application by email synchronously (for UI checks)
   */
  getLatestApplicationByEmailSync(email: string): CandidateApplication | undefined {
    return undefined;
  }

  /**
   * Create a new application
   */
  createApplication(application: Omit<CandidateApplication, 'id'>): Observable<CandidateApplication> {
    return this.http.post<{ success: boolean; data: CandidateApplication }>(`${this.apiBase}/applications`, application)
      .pipe(map(response => response.data));
  }

  /**
   * Update application status
   */
  updateApplicationStatus(id: string, status: ApplicationStatus): Observable<CandidateApplication | null> {
    return this.http.patch<{ success: boolean; data: CandidateApplication }>(`${this.apiBase}/applications/${id}/status`, { status })
      .pipe(map(response => response.data || null));
  }

  /**
   * Update payment status
   */
  updatePaymentStatus(id: string, paymentStatus: 'pending' | 'processing' | 'completed' | 'failed'): Observable<CandidateApplication | null> {
    return this.http.patch<{ success: boolean; data: CandidateApplication }>(`${this.apiBase}/applications/${id}/payment-status`, { paymentStatus })
      .pipe(map(response => response.data || null));
  }

  /**
   * Upload document
   */
  uploadDocument(applicationId: string, documentType: 'cv' | 'diploma' | 'idCard' | 'experienceCert', file: File): Observable<{ success: boolean; message: string }> {
    return of({ success: false, message: 'Le stockage permanent des documents doit encore être configuré.' });
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
