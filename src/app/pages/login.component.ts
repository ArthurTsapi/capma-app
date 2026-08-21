import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { LanguageService } from '../core/services/language.service';

type LoginRole = 'candidate' | 'admin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-capma-light-grey flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-6xl rounded-[40px] bg-white shadow-2xl overflow-hidden grid lg:grid-cols-[1.15fr_1fr]">
        <div class="relative bg-gradient-to-br from-capma-navy via-capma-blue to-[#2B7BC7] text-white p-8 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden">
          <div class="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-capma-orange/20 blur-3xl"></div>
          <div class="absolute -bottom-32 -right-10 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>

          <div class="relative">
            <p class="text-sm uppercase tracking-[0.3em] text-sky-100/80 mb-4">
              {{ selectedRole === 'admin' ? 'ESPACE ADMINISTRATION' : 'ESPACE CANDIDAT' }}
            </p>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
              {{ selectedRole === 'admin'
                ? 'Pilotez votre programme de certification'
                : 'Accédez à votre parcours CaPMA' }}
            </h1>
            <p class="text-sm text-sky-50/90 max-w-xl leading-relaxed">
              {{ selectedRole === 'admin'
                ? "Tableau de bord centralisé pour valider les dossiers, suivre les paiements, gérer les convocations et les sessions d'examen. Sécurisé, rapide, conforme."
                : 'Suivez l\'état de votre candidature, réalisez votre paiement, téléchargez votre convocation et passez votre examen QCM en ligne. Accès 24/7.' }}
            </p>
          </div>

          <div class="relative mt-10 text-sm text-slate-200 space-y-4">
            <div class="flex items-start gap-3">
              <div class="rounded-2xl bg-white/10 p-3 text-emerald-300">🔒</div>
              <div>
                <p class="font-semibold text-white">Authentification forte</p>
                <p class="text-slate-300/80 text-xs">
                  Identifiants fournis par CaPMA — Aucune inscription publique sur l'espace {{ selectedRole === 'admin' ? 'administrateur' : 'candidat QCM' }}.
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="rounded-2xl bg-white/10 p-3 text-emerald-300">🎯</div>
              <div>
                <p class="font-semibold text-white">
                  {{ selectedRole === 'admin' ? 'Contrôle total & traçabilité' : 'Accès conditionnel au QCM' }}
                </p>
                <p class="text-slate-300/80 text-xs">
                  {{ selectedRole === 'admin'
                    ? 'Toutes les actions sont journalisées : validation, rejet, paiement, convocation.'
                    : "Le QCM n'est accessible qu'après validation du dossier ET confirmation du paiement par l'administration." }}
                </p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="rounded-2xl bg-white/10 p-3 text-emerald-300">📡</div>
              <div>
                <p class="font-semibold text-white">Mode hors ligne compatible</p>
                <p class="text-slate-300/80 text-xs">
                  Si le backend est indisponible, utilisez les comptes de démonstration indiqués ci-dessous.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8 sm:p-10 lg:p-12">
          <div class="max-w-md mx-auto">
            <div class="mb-7">
              <p class="text-xs uppercase tracking-[0.4em] text-gray-500 mb-3">
                {{ lang.t('loginFormKicker') }}
              </p>
              <h2 class="text-3xl font-bold text-slate-900">
                {{ selectedRole === 'admin' ? 'Connexion admin' : lang.t('loginFormTitle') }}
              </h2>
              <p class="mt-2 text-sm text-gray-500">
                {{ selectedRole === 'admin'
                  ? 'Réservé aux administrateurs et validateurs CaPMA.'
                  : lang.t('loginFormSubtitle') }}
              </p>
            </div>

            <div class="mb-6 grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                (click)="selectRole('candidate')"
                class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                [ngClass]="selectedRole === 'candidate'
                  ? 'bg-white text-capma-blue shadow-sm ring-1 ring-capma-blue/20'
                  : 'text-slate-500 hover:text-slate-700'"
              >
                👤 Candidat
              </button>
              <button
                type="button"
                (click)="selectRole('admin')"
                class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                [ngClass]="selectedRole === 'admin'
                  ? 'bg-white text-capma-navy shadow-sm ring-1 ring-capma-navy/20'
                  : 'text-slate-500 hover:text-slate-700'"
              >
                🛡️ Admin
              </button>
            </div>

            @if (securityNotice) {
              <div class="mb-5 rounded-2xl border px-4 py-3 text-xs"
                [ngClass]="securityNotice.type === 'warn'
                  ? 'bg-amber-50 border-amber-100 text-amber-800'
                  : 'bg-blue-50 border-blue-100 text-capma-blue'">
                <strong class="mr-1">{{ securityNotice.title }} :</strong>
                {{ securityNotice.message }}
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5" autocomplete="off">
              <div class="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs text-slate-600">
                <strong class="text-slate-800">{{ lang.t('demo') }} :</strong>
                @if (selectedRole === 'admin') {
                  <div class="mt-1.5 font-mono text-[0.72rem] bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 w-fit">
                    admin&#64;capma.cm &nbsp;/&nbsp; Admin&#64;CaPMA2026
                  </div>
                } @else {
                  <div class="mt-1.5 font-mono text-[0.72rem] bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 w-fit">
                    demo&#64;capma.cm &nbsp;/&nbsp; password1
                  </div>
                }
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2" for="email">
                  {{ selectedRole === 'admin' ? 'Email professionnel' : lang.t('loginEmail') }}
                </label>
                <input
                  id="email"
                  name="capma-login-email"
                  [type]="emailFieldType"
                  formControlName="email"
                  autocomplete="username"
                  (keydown.paste)="onPasteBlocked($event)"
                  class="w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 text-sm text-slate-900 shadow-sm focus:border-capma-blue focus:outline-none focus:ring-2 focus:ring-capma-blue/20"
                  [placeholder]="selectedRole === 'admin' ? 'admin@capma.cm' : 'jean.pierre&#64;email.cm'"
                />
                <div class="flex flex-wrap gap-2 items-center justify-between mt-2 min-h-[1rem]">
                  <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-xs text-red-500">
                    {{ lang.t('loginInvalidEmail') }}
                  </p>
                  @if (selectedRole === 'admin') {
                    <button type="button" (click)="toggleEmailField()" class="ml-auto text-[0.7rem] text-slate-500 hover:text-capma-blue">
                      {{ emailFieldType === 'password' ? '👁 Afficher' : '🙈 Masquer' }} l'email
                    </button>
                  }
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2" for="password">
                  {{ selectedRole === 'admin' ? 'Mot de passe (fourni par CaPMA)' : lang.t('loginPassword') }}
                </label>
                <div class="relative">
                  <input
                    id="password"
                    name="capma-login-password"
                    [type]="passwordVisible ? 'text' : 'password'"
                    formControlName="password"
                    autocomplete="current-password"
                    (keydown.paste)="onPasteBlocked($event)"
                    class="w-full rounded-3xl border border-gray-200 bg-white px-5 pr-12 py-4 text-sm text-slate-900 shadow-sm focus:border-capma-blue focus:outline-none focus:ring-2 focus:ring-capma-blue/20"
                    [placeholder]="lang.t('loginPasswordPlaceholder')"
                  />
                  <button
                    type="button"
                    tabindex="-1"
                    (click)="passwordVisible = !passwordVisible"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-capma-blue hover:bg-slate-50 transition-colors"
                    [attr.aria-label]="passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                  >
                    {{ passwordVisible ? '🙈' : '👁' }}
                  </button>
                </div>
                <div class="flex items-center justify-between mt-2 min-h-[1rem]">
                  <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-xs text-red-500">
                    {{ lang.t('loginInvalidPassword') }}
                  </p>
                  <p class="ml-auto text-[0.68rem] text-slate-400">
                    {{ loginForm.get('password')?.value?.length || 0 }} caractères
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-500">
                <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" formControlName="rememberMe"
                    class="h-4 w-4 rounded border-gray-300 text-capma-blue focus:ring-capma-blue" />
                  {{ lang.t('loginRemember') }} · <span class="text-[0.7rem] text-slate-400">23h max</span>
                </label>
                <a routerLink="/contact" class="font-semibold text-capma-blue hover:text-capma-orange text-xs sm:text-sm">
                  {{ lang.t('loginForgot') }} → contact CaPMA
                </a>
              </div>

              <button
                type="submit"
                [disabled]="loginForm.invalid || isSubmitting || !canSubmitForRole"
                class="w-full rounded-3xl px-5 py-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-capma-blue/15"
                [ngClass]="selectedRole === 'admin'
                  ? 'bg-capma-navy hover:bg-slate-900'
                  : 'bg-capma-blue hover:bg-[#195796]'"
              >
                @if (isSubmitting) {
                  <span class="inline-flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
                    {{ lang.t('loginLoading') }}
                  </span>
                } @else {
                  {{ selectedRole === 'admin' ? "S'authentifier · Espace admin" : lang.t('loginSubmit') }}
                }
              </button>

              <p class="text-center text-[0.7rem] text-slate-400 pt-1">
                🔐 Session sécurisée · Tentatives limitées · Aucun mot de passe n'est stocké en clair côté navigateur.
              </p>
            </form>

            <div class="mt-8 pt-6 border-t border-slate-100 text-center">
              @if (selectedRole === 'candidate') {
                <p class="text-sm text-gray-500">
                  Pas encore de compte ?
                  <a routerLink="/register" class="font-semibold text-capma-blue hover:text-capma-orange">
                    Créer un compte candidat
                  </a>
                </p>
              } @else {
                <p class="text-xs text-slate-500 leading-relaxed">
                  ⚠️ L'espace administrateur <strong>n'est accessible que sur invitation</strong>.
                  Toute tentative d'accès non autorisée est journalisée.
                </p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isSubmitting = false;
  passwordVisible = false;
  emailFieldType: 'email' | 'password' = 'email';
  selectedRole: LoginRole = 'candidate';

  private redirectAfterLogin: string | null = null;
  private failedAttempts = 0;
  private lockUntil = 0;
  private subs = new Subscription();

  securityNotice: { title: string; message: string; type: 'info' | 'warn' } | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: NotificationService,
    public lang: LanguageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isLocked(): boolean {
    return this.isBrowser && Date.now() < this.lockUntil;
  }

  get canSubmitForRole(): boolean {
    const u = this.authService.getCurrentUserSync();
    if (!u) return true;
    if (this.selectedRole === 'admin') {
      return u.role !== 'admin' && u.role !== 'reviewer';
    }
    return u.role !== 'candidate';
  }

  ngOnInit(): void {
    this.redirectAfterLogin = this.route.snapshot.queryParamMap.get('redirect');
    const reason = this.route.snapshot.queryParamMap.get('reason');
    this.applyRouteContext();

    this.loginForm = this.fb.group({
      email: this.selectedRole === 'admin'
        ? ['admin@capma.cm', [Validators.required, Validators.email, Validators.maxLength(120)]]
        : ['demo@capma.cm', [Validators.required, Validators.email, Validators.maxLength(120)]],
      password: this.selectedRole === 'admin'
        ? ['Admin@CaPMA2026', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]]
        : ['password1', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      rememberMe: [true]
    });

    const already = this.authService.getCurrentUserSync();
    if (already) {
      this.securityNotice = {
        title: 'Session active',
        message: `Vous êtes connecté(e) en tant que ${already.firstName} ${already.lastName} (rôle : ${already.role}).`,
        type: 'info'
      };
    } else if (reason === 'auth-required') {
      this.securityNotice = {
        title: 'Connexion requise',
        message: "Vous devez vous identifier pour accéder à cette page.",
        type: 'warn'
      };
    } else if (reason === 'forbidden') {
      this.securityNotice = {
        title: 'Accès refusé',
        message: "Votre profil n'autorise pas l'accès à cette ressource. Utilisez un compte adapté.",
        type: 'warn'
      };
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectRole(role: LoginRole): void {
    if (this.selectedRole === role) return;
    this.selectedRole = role;
    this.applyRouteContext();
    const newEmail = role === 'admin' ? 'admin@capma.cm' : 'demo@capma.cm';
    const newPass = role === 'admin' ? 'Admin@CaPMA2026' : 'password1';
    this.loginForm.patchValue({ email: newEmail, password: newPass }, { emitEvent: false });
    this.loginForm.markAsPristine();
  }

  private applyRouteContext(): void {
    const url = this.redirectAfterLogin || '';
    if (url.startsWith('/admin') || url.startsWith('/dashboard')) {
      this.selectedRole = url.startsWith('/admin') ? 'admin' : 'candidate';
    }
  }

  toggleEmailField(): void {
    this.emailFieldType = this.emailFieldType === 'password' ? 'email' : 'password';
  }

  onPasteBlocked(event: Event): void {
    if (this.selectedRole === 'admin') {
      event.preventDefault();
      this.notifications.warning('Par sécurité, le collage est désactivé sur l\'espace admin.');
    }
  }

  onSubmit(): void {
    if (this.isLocked) {
      const remainingSec = Math.ceil((this.lockUntil - Date.now()) / 1000);
      this.notifications.error(`Compte temporairement verrouillé. Réessayez dans ${remainingSec}s.`);
      return;
    }
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const raw = this.loginForm.value;
    const email: string = (raw.email || '').trim();
    const password: string = raw.password || '';

    const roleMismatch = this.checkRoleMismatch(email);
    if (roleMismatch) {
      this.onAuthFailed("Ce compte ne correspond pas à l'espace sélectionné. Changez d'onglet (Candidat / Admin).");
      return;
    }

    this.subs.add(
      this.authService.login(email, password).subscribe({
        next: result => {
          if (result.success && result.user) {
            this.failedAttempts = 0;
            this.notifications.success(result.message || lang_t_loginSuccess(this.lang));
            const role = result.user.role as LoginRole | 'reviewer';
            const target =
              (this.redirectAfterLogin && this.isRedirectAllowedFor(this.redirectAfterLogin, role as LoginRole | 'reviewer'))
                ? this.redirectAfterLogin
                : (result.redirectTo ?? (role === 'admin' || role === 'reviewer' ? '/admin' : '/dashboard'));
            setTimeout(() => this.router.navigateByUrl(target), 250);
          } else {
            this.onAuthFailed(result.message || lang_t_loginFailed(this.lang));
          }
        },
        error: () => {
          this.onAuthFailed(lang_t_loginFailed(this.lang));
        },
        complete: () => {
          this.isSubmitting = false;
        }
      })
    );
  }

  private checkRoleMismatch(email: string): boolean {
    const lower = email.toLowerCase();
    if (this.selectedRole === 'admin' && lower === 'demo@capma.cm') return true;
    if (this.selectedRole === 'candidate' && lower === 'admin@capma.cm') return true;
    return false;
  }

  private isRedirectAllowedFor(url: string, role: LoginRole | 'reviewer'): boolean {
    if (!url) return false;
    if (role === 'admin' || role === 'reviewer') {
      return url.startsWith('/admin') || url === '/' || url.startsWith('/contact') || url.startsWith('/about');
    }
    return !url.startsWith('/admin');
  }

  private onAuthFailed(message: string): void {
    this.failedAttempts += 1;
    this.isSubmitting = false;
    if (this.failedAttempts >= 5) {
      this.lockUntil = Date.now() + Math.min(60_000, 30_000 + this.failedAttempts * 5_000);
      const secs = Math.ceil((this.lockUntil - Date.now()) / 1000);
      this.notifications.error(`Trop de tentatives. Connexion bloquée ${secs}s.`);
      this.securityNotice = {
        title: 'Sécurité',
        message: `Plusieurs échecs de connexion. Compte verrouillé ${secs} secondes.`,
        type: 'warn'
      };
    } else {
      this.notifications.error(message);
      this.loginForm.get('password')?.patchValue('');
      this.loginForm.get('password')?.markAsUntouched();
    }
  }
}

function lang_t_loginSuccess(lang: LanguageService): string {
  try { return lang.t('loginSuccess'); } catch { return 'Connexion réussie.'; }
}
function lang_t_loginFailed(lang: LanguageService): string {
  try { return lang.t('loginFailed'); } catch { return 'Identifiants invalides.'; }
}
