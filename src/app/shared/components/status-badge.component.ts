import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatus } from '../../core/models/certification.model';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
      [ngClass]="getBadgeClass()"
    >
      {{ getStatusLabel() }}
    </span>
  `,
  styles: []
})
export class StatusBadgeComponent {
  @Input() status!: ApplicationStatus;

  constructor(public lang: LanguageService) {}

  getStatusLabel(): string {
    const labels: Record<ApplicationStatus, string> = {
      submitted: this.lang.t('badgeSubmitted'),
      under_review: this.lang.t('badgeUnderReview'),
      approved: this.lang.t('badgeApproved'),
      paid: this.lang.t('badgePaid'),
      convoked: this.lang.t('badgeConvoked'),
      exam_completed: this.lang.t('badgeExamCompleted'),
      certified: this.lang.t('badgeCertified'),
      rejected: this.lang.t('badgeRejected')
    };
    return labels[this.status];
  }

  getBadgeClass(): string {
    switch (this.status) {
      case 'submitted':
      case 'approved':
      case 'certified':
        return 'bg-green-100 text-capma-success-green';
      case 'under_review':
      case 'paid':
        return 'bg-blue-100 text-capma-blue';
      case 'convoked':
      case 'exam_completed':
        return 'bg-yellow-100 text-orange-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
