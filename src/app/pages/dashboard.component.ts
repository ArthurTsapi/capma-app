import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subscription, switchMap, of } from 'rxjs';
import { ApplicationStatus, PaymentStatus, CandidateApplication, CertificationStep } from '../core/models/certification.model';
import { CertificationLevel } from '../core/models/certification.model';
import { ApplicationService } from '../core/services/application.service';
import { CertificationDataService } from '../core/services/certification-data.service';
import { NotificationService } from '../core/services/notification.service';
import { StepperComponent } from '../shared/components/stepper.component';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';
import { LanguageService } from '../core/services/language.service';
import { AuthService } from '../core/services/auth.service';

const STATUS_TO_STEP: Record<ApplicationStatus, number> = {
  submitted: 1,
  under_review: 2,
  approved: 3,
  paid: 4,
  convoked: 5,
  exam_completed: 6,
  certified: 7,
  rejected: 1
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StepperComponent, StatusBadgeComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-capma-light-grey py-8 px-4">
      <div class="max-w-4xl mx-auto" *ngIf="application$ | async as app; else noApplication">
        <ng-container *ngIf="level$ | async as level">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-capma-blue mb-2">{{ lang.t('dashHello') }} {{ app.firstName || app.userId }}</h1>
            <p class="text-slate-600">
              {{ lang.t('dashProgress') }} · {{ lang.t('dashTargetLevel') }} : <strong>{{ level.title }}</strong>
            </p>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
            <div class="flex items-start justify-between mb-4 flex-wrap gap-4">
              <div>
                <h2 class="text-xl font-bold text-slate-900">{{ app.firstName || '-' }} {{ app.lastName || '-' }}</h2>
                <p class="text-sm text-slate-500">
                  {{ lang.t('dashHeroKicker') }} · ID : {{ app.id }}
                </p>
                <p class="text-sm text-slate-500">
                  {{ lang.t('dashDepositDate') }} : {{ formatDate(app.appliedAt) }}
                </p>
                <p class="text-sm text-slate-500" *ngIf="app.email">
                  {{ app.email }} <span *ngIf="app.phone">· {{ app.phone }}</span>
                </p>
              </div>
              <div class="flex flex-col gap-2 items-start sm:items-end">
                <app-status-badge [status]="app.status"></app-status-badge>
                <span
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  [ngClass]="paymentStatusClass(app.paymentStatus)"
                >
                  <span [ngClass]="paymentStatusDot(app.paymentStatus)"></span>
                  {{ lang.t('dashPaymentTitle') }} : {{ getPaymentStatusLabel(app.paymentStatus) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div class="p-4 bg-capma-light-grey rounded-lg">
                <div class="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">{{ lang.t('dashTargetLevel') }}</div>
                <div class="text-lg font-bold text-capma-navy">{{ level.title }}</div>
              </div>
              <div class="p-4 bg-capma-light-grey rounded-lg">
                <div class="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">{{ lang.t('applyFees') }}</div>
                <div class="text-lg font-bold text-capma-orange">{{ level.totalFee | number }} FCFA</div>
                <div class="text-xs text-slate-500 mt-1">{{ lang.t('dashAmount') }} : {{ getPaymentStatusLabel(app.paymentStatus) }}</div>
              </div>
              <div class="p-4 bg-capma-light-grey rounded-lg">
                <div class="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">{{ lang.t('dashExamInfo') }}</div>
                <div class="text-lg font-bold text-slate-800">{{ level.examDetails.examType }}</div>
                <div class="text-xs text-slate-500 mt-1">{{ level.examDetails.durationMinutes }} min · {{ level.examDetails.passingScore }}%</div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 class="font-bold text-slate-900 mb-4 text-lg">{{ getStatusTitle(app.status) }}</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                {{ getStatusDescription(app.status) }}
              </p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h3 class="font-bold text-slate-900 mb-4 text-lg">{{ lang.t('applyDocs') }}</h3>
              <ul class="text-sm text-slate-600 space-y-2">
                <li class="flex justify-between border-b border-slate-100 pb-2">
                  <span>{{ lang.t('docCv') }}</span>
                  <span class="flex items-center gap-2"><span [ngClass]="app.documents.cvUrl ? 'text-capma-success-green' : 'text-capma-orange'">{{ app.documents.cvUrl ? lang.t('badgeSubmitted') : lang.t('dashPending') }}</span><label class="cursor-pointer text-capma-blue text-xs font-semibold hover:underline">Ajouter<input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" (change)="uploadDocument(app, 'cv', $event)"></label></span>
                </li>
                <li class="flex justify-between border-b border-slate-100 pb-2">
                  <span>{{ lang.t('docDiploma') }}</span>
                  <span class="flex items-center gap-2"><span [ngClass]="app.documents.diplomaUrl ? 'text-capma-success-green' : 'text-capma-orange'">{{ app.documents.diplomaUrl ? lang.t('badgeSubmitted') : lang.t('dashPending') }}</span><label class="cursor-pointer text-capma-blue text-xs font-semibold hover:underline">Ajouter<input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" (change)="uploadDocument(app, 'diploma', $event)"></label></span>
                </li>
                <li class="flex justify-between border-b border-slate-100 pb-2">
                  <span>{{ lang.t('docId') }}</span>
                  <span class="flex items-center gap-2"><span [ngClass]="app.documents.idCardUrl ? 'text-capma-success-green' : 'text-capma-orange'">{{ app.documents.idCardUrl ? lang.t('badgeSubmitted') : lang.t('dashPending') }}</span><label class="cursor-pointer text-capma-blue text-xs font-semibold hover:underline">Ajouter<input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" (change)="uploadDocument(app, 'idCard', $event)"></label></span>
                </li>
                <li class="flex justify-between">
                  <span>{{ lang.t('docExp') }}</span>
                  <span class="flex items-center gap-2"><span [ngClass]="app.documents.experienceCertUrl ? 'text-capma-success-green' : 'text-capma-orange'">{{ app.documents.experienceCertUrl ? lang.t('badgeSubmitted') : lang.t('dashPending') }}</span><label class="cursor-pointer text-capma-blue text-xs font-semibold hover:underline">Ajouter<input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" (change)="uploadDocument(app, 'experienceCert', $event)"></label></span>
                </li>
              </ul>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200" *ngIf="stepperInputs$ | async as si">
            <app-stepper [steps]="si.steps" [currentStep]="si.currentStep" [completedSteps]="si.completedSteps"></app-stepper>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-between flex-wrap">
            <a routerLink="/" class="px-6 py-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold text-center hover:bg-slate-50 transition">
              {{ lang.t('backToHome') }}
            </a>
            <div class="flex flex-col sm:flex-row gap-3">
              <a routerLink="/exam-simulator" class="px-6 py-3 rounded-lg bg-capma-navy text-white text-sm font-semibold text-center hover:bg-navy-800 transition">
                {{ lang.t('dashSimulateQcm') }}
              </a>
              <button
                (click)="onPay(app)"
                [disabled]="app.paymentStatus === 'completed'"
                class="px-6 py-3 rounded-lg bg-capma-orange text-white text-sm font-semibold hover:bg-[#E25D1B] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ lang.t('dashPayNow') }} · {{ level.totalFee | number }} FCFA
              </button>
              <button
                *ngIf="app.status === 'convoked' || app.status === 'paid' || app.status === 'exam_completed'"
                (click)="onDownloadConvocation(app)"
                class="px-6 py-3 rounded-lg bg-capma-blue text-white text-sm font-semibold hover:bg-[#2B7BC7] transition"
              >
                {{ lang.t('dashDownloadConv') }}
              </button>
            </div>
          </div>
        </ng-container>
      </div>

      <ng-template #noApplication>
        <div class="max-w-2xl mx-auto py-20 px-6 text-center">
          <h1 class="text-2xl font-bold text-capma-navy">Aucune candidature trouvée</h1>
          <p class="mt-3 text-slate-600">Votre compte candidat ne possède pas encore de dossier enregistré.</p>
          <a routerLink="/apply" class="inline-block mt-6 px-6 py-3 rounded-lg bg-capma-blue text-white font-semibold">
            Déposer mon dossier
          </a>
        </div>
      </ng-template>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  application$?: Observable<CandidateApplication | undefined>;
  level$?: Observable<CertificationLevel | undefined>;
  stepperInputs$?: Observable<{ steps: CertificationStep[]; currentStep: number; completedSteps: number[] }>;
  private subs = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private certificationDataService: CertificationDataService,
    private notifications: NotificationService,
    private authService: AuthService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    const resolveId$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        const currentUser = this.authService.getCurrentUserSync();
        if (id && (currentUser?.role === 'admin' || currentUser?.role === 'reviewer')) return of(id);
        if (!currentUser?.email) return of('');
        return this.applicationService.getLatestApplicationByEmail(currentUser.email).pipe(
          switchMap(app => of(app?.id || ''))
        );
      })
    );

    this.application$ = resolveId$.pipe(
      switchMap(id => id ? this.applicationService.getApplicationById(id) : of(undefined))
    );

    this.level$ = this.application$.pipe(
      switchMap(app => this.certificationDataService.getCertificationLevelById(app?.selectedLevelId || ''))
    );

    this.stepperInputs$ = this.application$.pipe(
      switchMap(app => {
        const currentStep = app ? STATUS_TO_STEP[app.status] || 1 : 1;
        const completed = Array.from({ length: Math.max(0, currentStep - 1) }, (_, i) => i + 1);
        if (app?.status === 'certified') completed.push(6, 7);
        return this.certificationDataService.getCertificationSteps().pipe(
          switchMap(steps => of({
            steps,
            currentStep,
            completedSteps: completed
          }))
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  formatDate(date?: Date): string {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getPaymentStatusLabel(status: PaymentStatus | undefined): string {
    switch (status) {
      case 'completed': return this.lang.t('badgePaid');
      case 'processing': return this.lang.t('dashPaymentProcessing');
      case 'failed': return this.lang.t('badgeRejected');
      default: return this.lang.t('dashPending');
    }
  }

  paymentStatusClass(status: PaymentStatus | undefined): string {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'processing': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'failed': return 'bg-rose-50 text-rose-700 border border-rose-200';
      default: return 'bg-sky-50 text-sky-700 border border-sky-200';
    }
  }

  paymentStatusDot(status: PaymentStatus | undefined): string {
    switch (status) {
      case 'completed': return 'h-2 w-2 rounded-full bg-emerald-500 animate-pulse';
      case 'processing': return 'h-2 w-2 rounded-full bg-amber-500 animate-pulse';
      case 'failed': return 'h-2 w-2 rounded-full bg-rose-500';
      default: return 'h-2 w-2 rounded-full bg-sky-500';
    }
  }

  getStatusTitle(status: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      submitted: this.lang.t('statusSubmitted'),
      under_review: this.lang.t('statusUnderReview'),
      approved: this.lang.t('statusApproved'),
      paid: this.lang.t('statusPaid'),
      convoked: this.lang.t('statusConvoked'),
      exam_completed: this.lang.t('statusExamCompleted'),
      certified: this.lang.t('statusCertified'),
      rejected: this.lang.t('statusRejected')
    };
    return map[status] || this.lang.t('statusGeneric');
  }

  getStatusDescription(status: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      submitted: this.lang.t('statusDescSubmitted'),
      under_review: this.lang.t('statusDescUnderReview'),
      approved: this.lang.t('statusDescApproved'),
      paid: this.lang.t('statusDescPaid'),
      convoked: this.lang.t('statusDescConvoked'),
      exam_completed: this.lang.t('statusDescExamCompleted'),
      certified: this.lang.t('statusDescCertified'),
      rejected: this.lang.t('statusDescRejected')
    };
    return map[status] || this.lang.t('statusDescGeneric');
  }

  onPay(app: CandidateApplication): void {
    this.subs.add(
      this.applicationService.requestPayment(app.id).subscribe({
        next: result => {
          this.notifications.success(`Demande de paiement enregistrée : ${result.transactionId}`);
          this.application$ = of(result.application);
          this.router.navigate(['/dashboard', app.id]);
        },
        error: err => this.notifications.error(err?.error?.message || 'Échec de la demande de paiement')
      })
    );
  }

  uploadDocument(app: CandidateApplication, type: 'cv' | 'diploma' | 'idCard' | 'experienceCert', event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.notifications.error('Le fichier ne doit pas dépasser 5 Mo');
      return;
    }
    this.subs.add(this.applicationService.uploadDocument(app.id, type, file).subscribe({
      next: response => {
        this.notifications.success(response.message);
        this.application$ = this.applicationService.getApplicationById(app.id);
      },
      error: err => this.notifications.error(err?.error?.message || 'Échec de l’enregistrement du document')
    }));
  }

  onDownloadConvocation(app: CandidateApplication): void {
    const url = app.convocationUrl || `data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAGNkDsOgCAQRf8nOE0gYGBgYGBgbGJABWERJSBqq/v+HYzDsN0r3pRQKCBIA7ADrA+g==`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `convocation-${app.id}.pdf`;
    link.click();
    this.notifications.success(this.lang.t('dashDownloadConv'));
  }
}
