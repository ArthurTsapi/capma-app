import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CertificationLevel, AuthorizedCenter } from '../core/models/certification.model';
import { CertificationDataService } from '../core/services/certification-data.service';
import { ApplicationService } from '../core/services/application.service';
import { NotificationService } from '../core/services/notification.service';
import { LanguageService } from '../core/services/language.service';
import { Subscription } from 'rxjs';

type UploadKey = 'cv' | 'diploma' | 'idCard' | 'experienceCert';

interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
}

interface DocField {
  key: UploadKey;
  label: string;
  hint: string;
}

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-capma-light-grey py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="bg-gradient-to-br from-capma-blue to-[#2B7BC7] text-white rounded-t-2xl p-6 sm:p-8">
          <a routerLink="/" class="text-orange-200 text-sm mb-4 inline-block hover:text-white">{{ lang.t('backToHome') }}</a>
          <h1 class="text-2xl sm:text-3xl font-bold mb-2 text-white">{{ lang.t('applyHeaderTitle') }}</h1>
          <p class="text-gray-300">
            {{ lang.t('applyHeaderLevel') }} :
            <span class="font-bold text-capma-orange">{{ selectedLevel?.title || lang.t('applyHeaderToSelect') }}</span>
          </p>
          <div class="mt-4 p-4 bg-capma-blue bg-opacity-30 rounded" *ngIf="selectedLevel">
            <p class="text-sm"><strong>{{ lang.t('applyFees') }} :</strong> {{ selectedLevel.totalFee | number }} FCFA</p>
            <p class="text-sm text-gray-300 mt-2">
              {{ lang.t('applyFeesBreakdown', { reg: selectedLevel.registrationFee, exam: selectedLevel.examFee }) }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-b-lg shadow-lg p-8">
          <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()">
            <div class="mb-8">
              <h2 class="text-xl font-bold text-capma-blue mb-6 border-b-2 border-capma-blue pb-3">
                {{ lang.t('applyPersonal') }}
              </h2>

              <div class="mb-4">
                <label for="selectedLevelId" class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ lang.t('applyLevel') }} *
                </label>
                <select
                  id="selectedLevelId"
                  formControlName="selectedLevelId"
                  (change)="onLevelChange()"
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-capma-blue focus:outline-none"
                >
                  <option value="">{{ lang.t('selectLevel') }}</option>
                  <option *ngFor="let level of certificationLevels" [value]="level.id">
                    {{ level.title }} — {{ level.totalFee | number }} FCFA
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2">{{ lang.t('applyFirstName') }} *</label>
                  <input id="firstName" type="text" formControlName="firstName"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-capma-blue focus:outline-none"
                    placeholder="Jean-Pierre" />
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2">{{ lang.t('applyLastName') }} *</label>
                  <input id="lastName" type="text" formControlName="lastName"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-capma-blue focus:outline-none"
                    placeholder="Mballa" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">{{ lang.t('applyEmail') }} *</label>
                  <input id="email" type="email" formControlName="email"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-capma-blue focus:outline-none"
                    placeholder="jean.pierre&#64;email.cm" />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">{{ lang.t('applyPhone') }} *</label>
                  <input id="phone" type="tel" formControlName="phone"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-capma-blue focus:outline-none"
                    placeholder="+237 6 XX XX XX XX" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="city" class="block text-sm font-semibold text-gray-700 mb-2">{{ lang.t('applyCity') }} *</label>
                  <select id="city" formControlName="city" (change)="onCityChange()"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-capma-blue focus:outline-none bg-white">
                    <option value="">{{ lang.t('selectCity') }}</option>
                    <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
                  </select>
                  <p *ngIf="applicationForm.get('city')?.touched && applicationForm.get('city')?.hasError('required')" class="text-red-500 text-xs mt-1">
                    {{ lang.t('cityRequired') }}
                  </p>
                </div>

                <div>
                  <label for="center" class="block text-sm font-semibold text-gray-700 mb-2">{{ lang.t('applyCenter') }} *</label>
                  <select id="center" formControlName="preferredCenterId"
                    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-capma-blue focus:outline-none bg-white">
                    <option value="">{{ lang.t('selectCenter') }}</option>
                    <option *ngFor="let center of filteredCenters" [value]="center.id">
                      {{ center.city }} — {{ center.location }}
                    </option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1" *ngIf="filteredCenters.length === 0 && applicationForm.get('city')?.value">
                    {{ lang.t('noCenterInCity') }}
                  </p>
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-bold text-capma-blue mb-6 border-b-2 border-capma-blue pb-3">
                {{ lang.t('applyDocs') }}
              </h2>
              <p class="text-sm text-gray-600 mb-6">
                {{ lang.t('applyDocsHint') }}
              </p>

              <div class="space-y-4">
                <div *ngFor="let doc of documentFields; trackBy: trackByDocKey">
                  <div class="block text-sm font-semibold text-gray-700 mb-2">{{ doc.label }} *</div>
                  <div
                    role="button"
                    tabindex="0"
                    class="block border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer select-none"
                    [ngClass]="uploadedFiles[doc.key] ? 'border-capma-success-green bg-green-50' : 'border-capma-blue hover:bg-blue-50'"
                    (click)="triggerFileInput(doc.key, $event)"
                    (keydown.enter)="triggerFileInput(doc.key, $event)"
                    (keydown.space)="triggerFileInput(doc.key, $event)"
                    (dragover)="onDragOver($event, doc.key)"
                    (dragleave)="onDragLeave($event, doc.key)"
                    (drop)="onFileDropped(doc.key, $event)"
                    [class.bg-blue-100]="dragOverKey === doc.key"
                  >
                    <div *ngIf="!uploadedFiles[doc.key]">
                      <svg class="w-8 h-8 text-capma-blue mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm9-13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p class="text-sm font-semibold text-capma-blue">{{ doc.hint }}</p>
                      <p class="text-xs text-gray-500">{{ lang.t('orClickBrowse') }}</p>
                    </div>
                    <div *ngIf="uploadedFiles[doc.key]">
                      <p class="text-sm font-semibold text-capma-success-green">✓ {{ uploadedFiles[doc.key]?.name }}</p>
                      <p class="text-xs text-gray-600 mt-1">{{ formatSize(uploadedFiles[doc.key]?.size || 0) }} — {{ lang.t('replaceFile') }}</p>
                    </div>
                  </div>
                  <input [id]="fileInputId(doc.key)" type="file" class="hidden hidden-important"
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    (change)="onFileSelected(doc.key, $event)" />
                  <button *ngIf="uploadedFiles[doc.key]" type="button"
                    class="mt-2 text-xs text-red-600 hover:underline"
                    (click)="removeFile(doc.key, $event)">
                    {{ lang.t('removeFile') }}
                  </button>
                </div>
              </div>
              <p *ngIf="!allDocumentsUploaded" class="text-xs text-capma-orange mt-4">
                {{ lang.t('allDocsRequired') }}
              </p>
            </div>

            <div class="mb-8">
              <div class="p-4 bg-green-50 border-l-4 border-capma-success-green rounded">
                <p class="text-sm text-gray-700">
                  <strong>{{ lang.t('securePayment') }}</strong><br>
                  {{ lang.t('securePaymentDesc') }}
                </p>
              </div>
            </div>

            <div class="flex gap-4">
              <button type="submit" [disabled]="!canSubmit"
                class="flex-1 btn-success text-lg font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ lang.t('submitApplication') }}
              </button>
              <a routerLink="/"
                class="px-6 py-3 border-2 border-capma-blue text-capma-blue font-semibold rounded-lg hover:bg-capma-light-grey transition-colors">
                {{ lang.t('cancel') }}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hidden-important {
      display: none !important;
      position: absolute !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
  `]
})
export class ApplyComponent implements OnInit, OnDestroy {
  applicationForm!: FormGroup;
  selectedLevel?: CertificationLevel;
  certificationLevels: CertificationLevel[] = [];
  authorizedCenters: AuthorizedCenter[] = [];
  filteredCenters: AuthorizedCenter[] = [];
  private subs = new Subscription();

  cities: string[] = [
    'Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Maroua', 'Ngaoundéré',
    'Bertoua', 'Ebolowa', 'Kribi', 'Limbé', 'Buea', 'Edéa', 'Kumba', 'Dschang',
    'Foumban', 'Nkongsamba', 'Sangmélima', 'Kousséri', 'Mokolo'
  ];

  private _documentFields: DocField[] = [];
  get documentFields(): DocField[] {
    return this._documentFields;
  }

  private buildDocFields(): DocField[] {
    return [
      { key: 'cv', label: this.lang.t('docCv'), hint: this.lang.t('docCvHint') },
      { key: 'diploma', label: this.lang.t('docDiploma'), hint: this.lang.t('docDiplomaHint') },
      { key: 'idCard', label: this.lang.t('docId'), hint: this.lang.t('docIdHint') },
      { key: 'experienceCert', label: this.lang.t('docExp'), hint: this.lang.t('docExpHint') }
    ];
  }

  uploadedFiles: Partial<Record<UploadKey, UploadedFileInfo>> = {};
  private fileStore: Partial<Record<UploadKey, File>> = {};
  dragOverKey: UploadKey | null = null;

  readonly maxFileSize = 5 * 1024 * 1024;

  trackByDocKey(_index: number, doc: DocField): UploadKey {
    return doc.key;
  }

  fileInputId(key: UploadKey): string {
    return `apply-file-input-${key}`;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private certificationDataService: CertificationDataService,
    private applicationService: ApplicationService,
    private notifications: NotificationService,
    public lang: LanguageService
  ) {
    this._documentFields = this.buildDocFields();
    this.initializeForm();
  }

  get allDocumentsUploaded(): boolean {
    return this.documentFields.every(doc => !!this.uploadedFiles[doc.key]);
  }

  get canSubmit(): boolean {
    return this.applicationForm.valid && this.allDocumentsUploaded;
  }

  ngOnInit(): void {
    this.subs.add(this.certificationDataService.getCertificationLevels().subscribe(levels => {
      this.certificationLevels = levels;
      const levelId = this.route.snapshot.paramMap.get('level');
      if (levelId) {
        this.applicationForm.patchValue({ selectedLevelId: levelId });
        this.onLevelChange();
      }
    }));

    this.subs.add(this.certificationDataService.getAuthorizedCenters().subscribe(centers => {
      this.authorizedCenters = centers;
      this.filteredCenters = centers;
    }));
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }

  private initializeForm(): void {
    this.applicationForm = this.formBuilder.group({
      selectedLevelId: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      city: ['', [Validators.required]],
      preferredCenterId: ['', [Validators.required]]
    });
  }

  onLevelChange(): void {
    const levelId = this.applicationForm.get('selectedLevelId')?.value;
    this.selectedLevel = this.certificationLevels.find(l => l.id === levelId);
  }

  onCityChange(): void {
    const city = this.applicationForm.get('city')?.value;
    const matching = this.authorizedCenters.filter(c => c.city === city);
    this.filteredCenters = matching.length > 0 ? matching : this.authorizedCenters;

    const currentCenter = this.applicationForm.get('preferredCenterId')?.value;
    if (currentCenter && !this.filteredCenters.some(c => c.id === currentCenter)) {
      this.applicationForm.patchValue({ preferredCenterId: '' });
    }

    if (matching.length === 1) {
      this.applicationForm.patchValue({ preferredCenterId: matching[0].id });
    }
  }

  triggerFileInput(documentType: UploadKey, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (typeof document === 'undefined') return;
    const input = document.getElementById(this.fileInputId(documentType)) as HTMLInputElement | null;
    if (input) {
      input.value = '';
      input.click();
    }
  }

  onDragOver(event: DragEvent, documentType: UploadKey): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverKey = documentType;
  }

  onDragLeave(event: DragEvent, documentType: UploadKey): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.dragOverKey === documentType) {
      this.dragOverKey = null;
    }
  }

  onFileSelected(documentType: UploadKey, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(documentType, file);
  }

  onFileDropped(documentType: UploadKey, event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverKey = null;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.processFile(documentType, file);
  }

  removeFile(documentType: UploadKey, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const { [documentType]: _removedFile, ...remainingStore } = this.fileStore;
    this.fileStore = remainingStore;
    const { [documentType]: _removedInfo, ...remainingInfo } = this.uploadedFiles;
    this.uploadedFiles = remainingInfo;
    if (typeof document !== 'undefined') {
      const input = document.getElementById(this.fileInputId(documentType)) as HTMLInputElement | null;
      if (input) input.value = '';
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  private processFile(documentType: UploadKey, file: File): void {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    const extensionOk = /\.(pdf|jpe?g|png)$/i.test(file.name);

    if (!allowed.includes(file.type) && !extensionOk) {
      this.notifications.error(this.lang.t('invalidFormat'));
      return;
    }

    if (file.size > this.maxFileSize) {
      this.notifications.error(this.lang.t('fileTooBig'));
      return;
    }

    const info: UploadedFileInfo = { name: file.name, size: file.size, type: file.type };
    this.fileStore = { ...this.fileStore, [documentType]: file };
    this.uploadedFiles = { ...this.uploadedFiles, [documentType]: info };
    this.notifications.success(this.lang.t('fileAdded', { file: file.name }));
  }

  onSubmit(): void {
    if (!this.canSubmit) {
      this.applicationForm.markAllAsTouched();
      this.notifications.warning(this.lang.t('incompleteForm'));
      return;
    }

    const formData = this.applicationForm.value;
    const levelId = formData.selectedLevelId;

    const newApplication = {
      userId: 'user-' + Date.now(),
      selectedLevelId: levelId,
      status: 'submitted' as const,
      appliedAt: new Date(),
      documents: {
        uploadedAt: new Date(),
        cvUrl: this.uploadedFiles.cv ? `local://${this.uploadedFiles.cv.name}` : undefined,
        diplomaUrl: this.uploadedFiles.diploma ? `local://${this.uploadedFiles.diploma.name}` : undefined,
        idCardUrl: this.uploadedFiles.idCard ? `local://${this.uploadedFiles.idCard.name}` : undefined,
        experienceCertUrl: this.uploadedFiles.experienceCert ? `local://${this.uploadedFiles.experienceCert.name}` : undefined
      },
      paymentStatus: 'pending' as const,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      preferredCenterId: formData.preferredCenterId
    };

    this.applicationService.createApplication(newApplication).subscribe(app => {
      this.notifications.success(this.lang.t('applicationSubmitted'));
      this.router.navigate(['/dashboard', app.id]);
    });
  }
}
