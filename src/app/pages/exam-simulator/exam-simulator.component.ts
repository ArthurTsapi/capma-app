import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamSimulator, ExamQuestion, ExamResult, ExamResponse, CandidateApplication } from '../../core/models/certification.model';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exam-simulator',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-capma-light-grey py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <ng-container *ngIf="!examAccessGranted; else examWrapper">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
            <div class="bg-gradient-to-r from-amber-50 to-red-50 px-6 sm:px-8 py-12 text-center">
              <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg border-4 border-amber-200 text-5xl mb-6">
                🔒
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-capma-navy mb-3">
                Accès à l'examen verrouillé
              </h1>
              <p class="text-slate-600 max-w-xl mx-auto mb-8">
                {{ lockReason || 'Votre dossier doit être validé et le paiement effectué avant de pouvoir accéder au QCM officiel.' }}
              </p>

              <div *ngIf="candidateApp" class="max-w-2xl mx-auto bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm text-left mb-8">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-lg text-capma-blue">État de mon dossier</h3>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-bold"
                    [ngClass]="statusBadgeClass(candidateApp.status)"
                  >
                    {{ statusLabel(candidateApp.status) }}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div class="rounded-lg bg-slate-50 p-3 flex justify-between">
                    <span class="text-slate-500">Candidat :</span>
                    <span class="font-semibold text-slate-800">
                      {{ candidateApp.firstName }} {{ candidateApp.lastName }}
                    </span>
                  </div>
                  <div class="rounded-lg bg-slate-50 p-3 flex justify-between">
                    <span class="text-slate-500">Niveau :</span>
                    <span class="font-semibold text-slate-800 uppercase">
                      {{ candidateApp.selectedLevelId }}
                    </span>
                  </div>
                  <div class="rounded-lg bg-slate-50 p-3 flex justify-between">
                    <span class="text-slate-500">Paiement :</span>
                    <span class="font-semibold" [ngClass]="candidateApp.paymentStatus === 'completed' ? 'text-capma-success-green' : 'text-amber-600'">
                      {{ paymentLabel(candidateApp.paymentStatus || 'pending') }}
                    </span>
                  </div>
                  <div class="rounded-lg bg-slate-50 p-3 flex justify-between">
                    <span class="text-slate-500">Date de dépôt :</span>
                    <span class="font-semibold text-slate-800">
                      {{ formatDate(candidateApp.appliedAt) }}
                    </span>
                  </div>
                </div>

                <div class="mt-6 pt-5 border-t border-slate-100">
                  <h4 class="font-semibold text-capma-navy mb-3">Prochaines étapes requises :</h4>
                  <ul class="space-y-2 text-sm text-slate-600">
                    <li class="flex items-start gap-2">
                      <span class="mt-1">
                        {{ candidateApp.status === 'under_review' ? '⏳' : (isApprovedOrBetter(candidateApp.status) ? '✅' : '⚠️') }}
                      </span>
                      <span>Validation administrative des pièces justificatives</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-1">
                        {{ candidateApp.paymentStatus === 'completed' ? '✅' : '⏳' }}
                      </span>
                      <span>Paiement des frais de certification ({{ formatFee(candidateApp.selectedLevelId) }})</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-1">
                        {{ isAccessStatus(candidateApp.status) ? '✅' : '⏳' }}
                      </span>
                      <span>Convocation à l'examen envoyée par email</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a routerLink="/dashboard" class="btn-primary px-6 py-3 inline-block">
                  ← Retourner à mon tableau de bord
                </a>
                <a routerLink="/contact" class="px-6 py-3 border-2 border-capma-blue text-capma-blue rounded-lg hover:bg-capma-blue/5 font-semibold">
                  Contacter le support
                </a>
              </div>

              <p class="text-xs text-slate-400 mt-8">
                Identifiant de session : <code class="bg-slate-100 px-2 py-0.5 rounded">{{ sessionId }}</code>
              </p>
            </div>
          </div>
        </ng-container>

        <ng-template #examWrapper>
          <div class="bg-capma-navy text-white rounded-lg p-6 mb-8">
            <a routerLink="/dashboard" class="text-capma-orange text-sm mb-3 inline-block">← {{ lang.t('examBackDash') }}</a>
            <h1 class="text-3xl font-bold mb-2">{{ lang.t('examTitle') }}</h1>
            <p class="text-gray-300">{{ lang.t('examSubtitle') }}</p>
          </div>

          <div class="card p-8">
            <ng-container *ngIf="!examStarted && !examFinished">
              <div class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h2 class="text-2xl font-bold text-capma-blue mb-4">{{ lang.t('examReady') }}</h2>
                <p class="text-gray-600 mb-6 max-w-md mx-auto">
                  {{ lang.t('examReadyDesc') }}
                </p>

                <div class="bg-capma-light-grey rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                  <h3 class="font-bold text-capma-blue mb-3">{{ lang.t('examConditions') }}</h3>
                  <ul class="text-sm space-y-2 text-gray-700">
                    <li>✓ {{ lang.t('examCond1') }}</li>
                    <li>✓ {{ lang.t('examCond2') }}</li>
                    <li>✓ {{ lang.t('examCond3') }}</li>
                    <li>✓ {{ lang.t('examCond4') }}</li>
                    <li>✓ {{ lang.t('examCond5') }}</li>
                  </ul>
                </div>

                <button (click)="startExam()" class="btn-success text-lg px-8 py-3 inline-block">
                  {{ lang.t('examStart') }}
                </button>
              </div>
            </ng-container>

            <ng-container *ngIf="examStarted && !examFinished">
              <div>
                <div class="mb-8">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-semibold text-capma-blue">
                      {{ lang.t('examQuestion', { cur: currentQuestionIndex + 1, total: questions.length }) }}
                    </span>
                    <span class="text-sm font-semibold text-capma-orange">
                      {{ lang.t('examTime') }}: {{ timeRemaining }}:00
                    </span>
                  </div>
                  <div class="w-full bg-gray-300 rounded-full h-2">
                    <div
                      class="bg-capma-blue h-2 rounded-full transition-all"
                      [style.width]="((currentQuestionIndex + 1) / questions.length * 100) + '%'"
                    ></div>
                  </div>
                </div>

                <div class="mb-8">
                  <h3 class="text-lg font-bold text-capma-blue mb-6">
                    {{ currentQuestion?.question }}
                  </h3>

                  <div class="space-y-3">
                    <div
                      *ngFor="let option of currentQuestion?.options; let i = index"
                      class="p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-capma-blue hover:bg-blue-50"
                      [ngClass]="
                        selectedAnswers[currentQuestionIndex] === i
                          ? 'border-capma-blue bg-blue-50'
                          : 'border-gray-300'
                      "
                      (click)="selectAnswer(i)"
                    >
                      <label class="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          [name]="'question-' + currentQuestionIndex"
                          [checked]="selectedAnswers[currentQuestionIndex] === i"
                          class="w-4 h-4 text-capma-blue"
                        />
                        <span class="ml-3 text-gray-800">{{ option }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between gap-4">
                  <button
                    (click)="previousQuestion()"
                    [disabled]="currentQuestionIndex === 0"
                    class="px-6 py-2 border-2 border-capma-blue text-capma-blue rounded-lg hover:bg-capma-light-grey disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← {{ lang.t('examPrev') }}
                  </button>

                  <div class="flex gap-2">
                    <button
                      (click)="resetExam()"
                      class="px-4 py-2 border-2 border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      {{ lang.t('examReset') }}
                    </button>

                    <button
                      *ngIf="currentQuestionIndex === questions.length - 1"
                      (click)="finishExam()"
                      class="btn-success px-6 py-2"
                    >
                      {{ lang.t('examFinish') }}
                    </button>
                    <button
                      *ngIf="currentQuestionIndex < questions.length - 1"
                      (click)="nextQuestion()"
                      class="px-6 py-2 bg-capma-blue text-white rounded-lg hover:bg-blue-700"
                    >
                      {{ lang.t('examNext') }} →
                    </button>
                  </div>
                </div>

                <div class="mt-8 p-4 bg-capma-light-grey rounded-lg">
                  <h4 class="font-semibold text-capma-blue mb-3">{{ lang.t('examNav') }}</h4>
                  <div class="grid grid-cols-5 gap-2">
                    <button
                      *ngFor="let _ of [].constructor(questions.length); let idx = index"
                      (click)="jumpToQuestion(idx)"
                      class="w-8 h-8 rounded text-sm font-bold transition-all"
                      [ngClass]="
                        idx === currentQuestionIndex
                          ? 'bg-capma-blue text-white'
                          : selectedAnswers[idx] !== undefined
                          ? 'bg-capma-success-green text-white'
                          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                      "
                    >
                      {{ idx + 1 }}
                    </button>
                  </div>
                </div>
              </div>
            </ng-container>

            <ng-container *ngIf="examFinished && examResult">
              <div class="text-center py-12">
                <div class="mb-4">
                  <span *ngIf="examResult.passed" class="text-6xl">✅</span>
                  <span *ngIf="!examResult.passed" class="text-6xl">❌</span>
                </div>

                <h2 class="text-3xl font-bold mb-4" [ngClass]="examResult.passed ? 'text-capma-success-green' : 'text-red-600'">
                  {{ examResult.passed ? lang.t('examResultPass') : lang.t('examResultFail') }}
                </h2>

                <div class="bg-capma-light-grey rounded-lg p-8 max-w-md mx-auto mb-8">
                  <div class="mb-6">
                    <p class="text-sm text-gray-600 mb-1">{{ lang.t('examScoreObt') }}</p>
                    <p class="text-5xl font-bold text-capma-blue">
                      {{ examResult.percentageScore }}%
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="p-3 bg-white rounded">
                      <p class="text-xs text-gray-600">{{ lang.t('examCorrect') }}</p>
                      <p class="text-2xl font-bold text-capma-success-green">
                        {{ examResult.score }}/{{ examResult.maxScore }}
                      </p>
                    </div>
                    <div class="p-3 bg-white rounded">
                      <p class="text-xs text-gray-600">{{ lang.t('examScoreReq') }}</p>
                      <p class="text-2xl font-bold text-capma-orange">75%</p>
                    </div>
                  </div>

                  <div class="text-sm text-gray-700">
                    <p class="mb-2">
                      <strong>{{ lang.t('examPassedLbl') }}:</strong> {{ examResult.percentageScore >= 75 ? lang.t('yes') : lang.t('no') }}
                    </p>
                    <p *ngIf="!examResult.passed" class="text-red-600">
                      {{ lang.t('examMissing', { val: Math.round(75 - examResult.percentageScore) }) }}
                    </p>
                  </div>
                </div>

                <div class="text-left max-w-2xl mx-auto mb-8">
                  <h3 class="font-bold text-capma-blue mb-4">{{ lang.t('examDetail') }}</h3>
                  <div class="space-y-2 max-h-96 overflow-y-auto">
                    <div
                      *ngFor="let response of examResult.responses; let i = index"
                      class="p-3 bg-gray-50 rounded border-l-4"
                      [ngClass]="response.isCorrect ? 'border-capma-success-green' : 'border-red-600'"
                    >
                      <p class="text-sm font-semibold">{{ lang.t('examQuestionNo', { no: i + 1 }) }}</p>
                      <p class="text-xs text-gray-600">
                        {{ response.isCorrect ? '✓ ' + lang.t('examCorrectLbl') : '✗ ' + lang.t('examIncorrectLbl') }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-3">
                  <button (click)="resetExam()" class="btn-primary px-8 py-3">
                    {{ lang.t('examRetry') }}
                  </button>
                  <a
                    routerLink="/dashboard"
                    class="px-8 py-3 border-2 border-capma-blue text-capma-blue rounded-lg hover:bg-capma-light-grey text-center"
                  >
                    {{ lang.t('examBackToDash') }}
                  </a>
                </div>
              </div>
            </ng-container>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class ExamSimulatorComponent implements OnInit, OnDestroy {
  questions: ExamQuestion[] = [];
  private subs = new Subscription();

  currentQuestionIndex = 0;
  examStarted = false;
  examFinished = false;
  examResult?: ExamResult;
  selectedAnswers: (number | undefined)[] = [];
  timeRemaining = 10;
  Math = Math;

  examAccessGranted = false;
  lockReason = '';
  candidateApp: CandidateApplication | undefined;
  sessionId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public lang: LanguageService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private notifications: NotificationService
  ) {
    this.sessionId = 'sess_' + Math.random().toString(36).slice(2, 10).toUpperCase();
  }

  ngOnInit(): void {
    this.buildQuestions();
    this.subs.add(this.lang.language$.subscribe(() => {
      this.buildQuestions();
    }));
    this.initializeExam();
    this.checkExamAccess();
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  private checkExamAccess(): void {
    const currentUser = this.authService.getCurrentUserSync();
    if (!currentUser) {
      this.examAccessGranted = false;
      this.lockReason = 'Vous devez être connecté pour accéder à l\'examen.';
      return;
    }
    if (this.authService.hasRoleSync('admin', 'reviewer')) {
      this.examAccessGranted = true;
      return;
    }
    const app = this.applicationService.getLatestApplicationByEmailSync(currentUser.email);
    this.candidateApp = app;
    if (!app) {
      this.examAccessGranted = false;
      this.lockReason = 'Aucune candidature trouvée à votre nom. Veuillez d\'abord déposer un dossier de candidature ou contacter l\'administrateur CaPMA.';
      return;
    }
    if (!this.isApprovedOrBetter(app.status)) {
      this.examAccessGranted = false;
      this.lockReason = 'Votre candidature est en cours de validation administrative. L\'accès à l\'examen sera débloqué une fois vos pièces justificatives approuvées.';
      return;
    }
    if (app.paymentStatus !== 'completed') {
      this.examAccessGranted = false;
      this.lockReason = 'Votre paiement n\'a pas encore été enregistré. Merci de régler les frais de certification pour débloquer l\'examen.';
      return;
    }
    if (!this.isAccessStatus(app.status)) {
      this.examAccessGranted = false;
      this.lockReason = 'Votre convocation à l\'examen est en cours de préparation. Vous recevrez un email dès que l\'accès au QCM sera disponible.';
      return;
    }
    this.examAccessGranted = true;
    this.notifications.success('Accès autorisé. Bonne chance pour votre examen !');
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'under_review': return 'À l\'étude';
      case 'approved': return 'Approuvé';
      case 'paid': return 'Payé';
      case 'convoked': return 'Convoqué';
      case 'completed': return 'Terminé';
      case 'certified': return 'Certifié';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
      case 'under_review':
        return 'bg-amber-100 text-amber-800';
      case 'approved':
        return 'bg-sky-100 text-sky-800';
      case 'paid':
      case 'convoked':
      case 'completed':
      case 'certified':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  paymentLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Payé ✓';
      case 'processing': return 'En cours...';
      case 'failed': return 'Échoué';
      case 'pending':
      default: return 'En attente';
    }
  }

  isApprovedOrBetter(status: string): boolean {
    return ['approved', 'paid', 'convoked', 'certified', 'completed'].includes(status);
  }

  isAccessStatus(status: string): boolean {
    return ['paid', 'convoked', 'certified', 'completed'].includes(status);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '—';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('fr-CM', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  }

  formatFee(levelId: string | undefined): string {
    const level = String(levelId || 'practitioner').toLowerCase();
    const fees: Record<string, number> = {
      foundation: 50000,
      practitioner: 75000,
      expert: 120000
    };
    const f = fees[level] || 75000;
    return f.toLocaleString('fr-FR') + ' FCFA';
  }

  private buildQuestions(): void {
    this.questions = Array.from({ length: 10 }, (_, qi) => {
      const qIdx = qi + 1;
      return {
        id: String(qIdx),
        question: this.lang.t(('q' + qIdx) as any),
        options: [
          this.lang.t(('q' + qIdx + 'o1') as any),
          this.lang.t(('q' + qIdx + 'o2') as any),
          this.lang.t(('q' + qIdx + 'o3') as any),
          this.lang.t(('q' + qIdx + 'o4') as any)
        ],
        correctAnswer: this.correctFor(qIdx)
      };
    });
  }

  private correctFor(idx: number): number {
    const mapping: Record<number, number> = {
      1: 0, 2: 1, 3: 0, 4: 1, 5: 1, 6: 1, 7: 0, 8: 1, 9: 1, 10: 0
    };
    return mapping[idx] ?? 0;
  }

  private initializeExam(): void {
    this.selectedAnswers = new Array(this.questions.length).fill(undefined);
  }

  get currentQuestion(): ExamQuestion | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  startExam(): void {
    this.examStarted = true;
    this.startTimer();
  }

  selectAnswer(optionIndex: number): void {
    this.selectedAnswers[this.currentQuestionIndex] = optionIndex;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  jumpToQuestion(index: number): void {
    this.currentQuestionIndex = index;
  }

  finishExam(): void {
    this.calculateResults();
    this.examFinished = true;
  }

  resetExam(): void {
    this.currentQuestionIndex = 0;
    this.examStarted = false;
    this.examFinished = false;
    this.examResult = undefined;
    this.selectedAnswers = new Array(this.questions.length).fill(undefined);
    this.timeRemaining = 10;
  }

  private calculateResults(): void {
    let correctCount = 0;
    const responses: ExamResponse[] = [];

    this.questions.forEach((question, index) => {
      const selectedAnswer = this.selectedAnswers[index];
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctCount++;
      }

      responses.push({
        questionId: question.id,
        selectedAnswerIndex: selectedAnswer || 0,
        isCorrect
      });
    });

    const percentageScore = Math.round((correctCount / this.questions.length) * 100);

    this.examResult = {
      id: 'result-' + Date.now(),
      candidateId: 'candidate-demo',
      examId: 'exam-practitioner',
      score: correctCount,
      maxScore: this.questions.length,
      percentageScore,
      passed: percentageScore >= 75,
      completedAt: new Date(),
      responses
    };
  }

  private startTimer(): void {
    const interval = setInterval(() => {
      this.timeRemaining--;

      if (this.timeRemaining <= 0) {
        clearInterval(interval);
        this.finishExam();
      }
    }, 60000);
  }
}
