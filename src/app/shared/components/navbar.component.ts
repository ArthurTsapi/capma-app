import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, UserRole } from '../../core/services/auth.service';
import { LanguageService, AppLanguage } from '../../core/services/language.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/certification.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="sticky top-0 z-50 border-b border-sky-100/80 bg-white/85 backdrop-blur-xl shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-[4.25rem]">
          <a routerLink="/" class="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <img
              src="/assets/capma-logo.jpeg"
              alt="CaPMA — Cameroon Project Management Association"
              class="block h-11 sm:h-12 w-auto max-w-[220px] object-contain object-left"
            />
          </a>

          <div class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a routerLink="/" class="hover:text-capma-blue transition-colors">{{ lang.t('home') }}</a>
            <a routerLink="/" fragment="certifications" class="hover:text-capma-blue transition-colors">{{ lang.t('certifications') }}</a>
            <a routerLink="/" fragment="centers" class="hover:text-capma-blue transition-colors">{{ lang.t('centers') }}</a>
            <a routerLink="/recertification" class="hover:text-capma-blue transition-colors">{{ lang.t('recertification') }}</a>
            <a routerLink="/about" class="hover:text-capma-blue transition-colors">{{ lang.t('about') }}</a>
          </div>

          <div class="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              type="button"
              (click)="switchLanguage('fr')"
              class="px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
              [ngClass]="currentLang === 'fr' ? 'bg-capma-blue text-white' : 'border border-sky-200 text-slate-600 hover:border-capma-blue'"
            >
              FR
            </button>
            <button
              type="button"
              (click)="switchLanguage('en')"
              class="px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
              [ngClass]="currentLang === 'en' ? 'bg-capma-blue text-white' : 'border border-sky-200 text-slate-600 hover:border-capma-blue'"
            >
              EN
            </button>

            <ng-container *ngIf="currentUser; else guestLinks">
              <ng-container *ngIf="isAdminOrReviewer">
                <a routerLink="/admin" class="text-sm font-semibold text-capma-navy hover:text-capma-orange transition-colors flex items-center gap-1">
                  🛡️ Admin
                </a>
              </ng-container>
              <ng-container *ngIf="isCandidate">
                <a routerLink="/dashboard" class="text-sm font-semibold text-capma-blue hover:text-capma-orange transition-colors">{{ lang.t('dashboard') }}</a>
              </ng-container>
              <ng-container *ngIf="isCandidate">
                <a routerLink="/exam-simulator" class="btn-secondary text-sm !py-2 !px-4">{{ lang.t('simulateQcm') }}</a>
              </ng-container>
              <div class="flex items-center gap-2 pl-1 ml-1 border-l border-slate-200">
                <div class="hidden xl:flex flex-col items-end leading-tight">
                  <span class="text-[0.7rem] text-slate-400">{{ roleLabel }}</span>
                  <span class="text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                    {{ currentUser.firstName }} {{ currentUser.lastName }}
                  </span>
                </div>
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-capma-blue/20 to-capma-orange/20 flex items-center justify-center text-xs font-bold text-capma-blue border border-sky-100">
                  {{ currentUser.firstName.charAt(0) }}{{ currentUser.lastName.charAt(0) }}
                </div>
                <button type="button" (click)="logout()"
                  class="text-sm text-slate-600 hover:text-capma-orange transition-colors"
                  [attr.title]="lang.t('logout')">
                  ⎋
                </button>
              </div>
            </ng-container>

            <ng-template #guestLinks>
              <a routerLink="/login" class="text-sm font-semibold text-capma-blue hover:text-capma-orange transition-colors">{{ lang.t('login') }}</a>
              <a routerLink="/apply" class="btn-primary text-sm !py-2 !px-4 !w-auto">{{ lang.t('register') }}</a>
            </ng-template>
          </div>

          <button
            type="button"
            class="md:hidden inline-flex items-center justify-center rounded-xl border border-sky-200 bg-white p-2 text-capma-blue"
            (click)="menuOpen = !menuOpen"
            [attr.aria-expanded]="menuOpen"
            aria-label="Menu"
          >
            <svg *ngIf="!menuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg *ngIf="menuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div *ngIf="menuOpen" class="md:hidden pb-4 animate-fade-in-up">
          <div class="rounded-2xl border border-sky-100 bg-white p-4 shadow-lg space-y-3">
            <a routerLink="/" (click)="closeMenu()" class="block py-2 text-slate-700 font-medium">{{ lang.t('home') }}</a>
            <a routerLink="/" fragment="certifications" (click)="closeMenu()" class="block py-2 text-slate-700 font-medium">{{ lang.t('certifications') }}</a>
            <a routerLink="/" fragment="centers" (click)="closeMenu()" class="block py-2 text-slate-700 font-medium">{{ lang.t('centers') }}</a>
            <a routerLink="/recertification" (click)="closeMenu()" class="block py-2 text-slate-700 font-medium">{{ lang.t('recertification') }}</a>
            <a routerLink="/about" (click)="closeMenu()" class="block py-2 text-slate-700 font-medium">{{ lang.t('about') }}</a>
            <div class="flex gap-2 pt-2">
              <button type="button" (click)="switchLanguage('fr')" class="flex-1 rounded-full py-2 text-xs font-semibold" [ngClass]="currentLang === 'fr' ? 'bg-capma-blue text-white' : 'border border-sky-200'">FR</button>
              <button type="button" (click)="switchLanguage('en')" class="flex-1 rounded-full py-2 text-xs font-semibold" [ngClass]="currentLang === 'en' ? 'bg-capma-blue text-white' : 'border border-sky-200'">EN</button>
            </div>
            <div class="grid gap-2 pt-2" *ngIf="currentUser; else mobileGuest">
              <div *ngIf="currentUser" class="text-xs text-slate-500 px-1 py-1">
                Connecté en tant que <strong class="text-slate-700">{{ currentUser.firstName }} {{ currentUser.lastName }}</strong>
                <span class="inline-flex ml-1.5 px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[0.62rem] font-semibold uppercase tracking-wide">{{ roleLabel }}</span>
              </div>
              <a *ngIf="isAdminOrReviewer" routerLink="/admin" (click)="closeMenu()" class="btn-primary text-center">🛡️ Tableau de bord admin</a>
              <a *ngIf="isCandidate" routerLink="/dashboard" (click)="closeMenu()" class="btn-primary text-center">{{ lang.t('dashboard') }}</a>
              <a *ngIf="isCandidate" routerLink="/exam-simulator" (click)="closeMenu()" class="btn-secondary text-center">{{ lang.t('simulateQcm') }}</a>
              <button type="button" (click)="logout(); closeMenu()" class="py-2 text-sm text-slate-600 hover:text-red-600 font-medium">
                {{ lang.t('logout') }}
              </button>
            </div>
            <ng-template #mobileGuest>
              <div class="grid gap-2 pt-2">
                <a routerLink="/login" (click)="closeMenu()" class="btn-primary text-center">{{ lang.t('login') }}</a>
                <a routerLink="/apply" (click)="closeMenu()" class="btn-secondary text-center">{{ lang.t('register') }}</a>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentLang: AppLanguage = 'fr';
  menuOpen = false;
  private subs = new Subscription();

  constructor(
    public lang: LanguageService,
    private authService: AuthService,
    private notifications: NotificationService,
    private router: Router
  ) {}

  get isAdminOrReviewer(): boolean {
    return this.authService.hasRoleSync('admin', 'reviewer');
  }

  get isCandidate(): boolean {
    return this.authService.hasRoleSync('candidate');
  }

  get roleLabel(): string {
    const r = this.currentUser?.role as UserRole | undefined;
    switch (r) {
      case 'admin': return 'Administrateur';
      case 'reviewer': return 'Validateur';
      case 'candidate': return 'Candidat';
      default: return 'Invité';
    }
  }

  ngOnInit(): void {
    this.currentLang = this.lang.currentLanguage;
    this.subs.add(this.lang.language$.subscribe(lang => {
      this.currentLang = lang;
    }));
    this.subs.add(this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  switchLanguage(lang: AppLanguage): void {
    if (this.currentLang === lang) {
      return;
    }
    this.lang.setLanguage(lang);
    this.currentLang = lang;
    this.notifications.info(this.lang.t('languageChanged'));
  }

  logout(): void {
    this.subs.add(
      this.authService.logout().subscribe({
        complete: () => {
          this.notifications.success('Vous avez été déconnecté(e).');
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
