import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CertificationDataService } from '../core/services/certification-data.service';
import { CertificationLevel, AuthorizedCenter, CertificationStep } from '../core/models/certification.model';
import { CertificationCardComponent } from '../shared/components/certification-card.component';
import { AnimatedHeroComponent } from '../shared/components/animated-hero.component';
import { TestimonialsComponent } from '../shared/components/testimonials.component';
import { CtaComponent } from '../shared/components/cta.component';
import { LanguageService } from '../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CertificationCardComponent, AnimatedHeroComponent, TestimonialsComponent, CtaComponent],
  template: `
    <app-animated-hero></app-animated-hero>

    <!-- Certification Levels Section -->
    <section id="certifications" class="py-12 sm:py-16 px-4 bg-capma-light-grey">
      <div class="max-w-7xl mx-auto">
        <div class="max-w-2xl mx-auto text-center mb-10 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl font-bold text-capma-navy">{{ lang.t('levelsTitle') }}</h2>
          <p class="text-slate-600 mt-4 text-sm sm:text-base">
            {{ lang.t('levelsSubtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          <app-certification-card *ngFor="let level of certificationLevels" [level]="level"></app-certification-card>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <app-cta></app-cta>

    <!-- Testimonials -->
    <app-testimonials></app-testimonials>

    <!-- Certification Process Steps -->
    <section class="py-16 sm:py-20 px-4 bg-gradient-to-b from-white to-capma-sky relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 opacity-50" style="background-image: linear-gradient(rgba(30,104,179,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,104,179,0.05) 1px, transparent 1px); background-size: 32px 32px;"></div>
      <div class="relative max-w-7xl mx-auto text-center mb-10 sm:mb-14">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-capma-navy">{{ lang.t('processTitle') }}</h2>
        <p class="text-slate-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
          {{ lang.t('processSubtitle') }}
        </p>
      </div>

      <div class="relative max-w-7xl mx-auto grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div *ngFor="let step of certificationSteps; let i = index" class="tech-panel hover-lift p-5 sm:p-6" [style.animation-delay]="(i * 80) + 'ms'">
          <div class="relative z-10">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-100 text-capma-blue flex items-center justify-center text-xl">
                {{ getStepIcon(step.icon) }}
              </div>
              <div class="text-lg font-semibold text-capma-orange">{{ step.id < 10 ? '0' + step.id : step.id }}</div>
            </div>
            <h3 class="font-semibold text-capma-navy text-base sm:text-lg mb-2">{{ step.title }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Authorized Centers Section -->
    <section id="centers" class="py-12 sm:py-20 px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid gap-8 lg:gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold mb-4 text-capma-navy">{{ lang.t('centersTitle') }}</h2>
            <p class="text-slate-600 max-w-xl mb-8 sm:mb-10 text-sm sm:text-base">
              {{ lang.t('centersSubtitle') }}
            </p>

            <div class="grid gap-4 sm:gap-6 sm:grid-cols-2">
              <div *ngFor="let center of authorizedCenters" class="rounded-3xl bg-capma-mist p-5 sm:p-6 shadow-md border border-sky-100 hover-lift">
                <div class="flex items-center gap-3 mb-3 text-base sm:text-lg font-semibold text-slate-900">
                  <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">📍</span>
                  <div>
                    <div>{{ center.city }}</div>
                    <div class="text-sm text-slate-500">{{ center.location }}</div>
                  </div>
                </div>
                <div class="space-y-3 text-sm text-slate-600 mb-6">
                  <div class="flex items-center gap-3"><span>💻</span><span>{{ lang.t('centerComp') }}</span></div>
                  <div class="flex items-center gap-3"><span>📶</span><span>{{ lang.t('centerNet') }}</span></div>
                  <div class="flex items-center gap-3"><span>🎥</span><span>{{ lang.t('centerCctv') }}</span></div>
                </div>
                <a routerLink="/apply" class="block w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-capma-blue text-center transition hover:bg-sky-50">
                  {{ lang.t('centerBook') }}
                </a>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-[28px] sm:rounded-[32px] shadow-xl min-h-[240px] sm:min-h-[420px] lg:min-h-[560px] tech-panel">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="CaPMA authorized center" class="relative z-10 h-full w-full object-cover min-h-[240px] sm:min-h-[420px] lg:min-h-[560px]" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16 px-4 bg-capma-light-grey">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-capma-navy">{{ lang.t('whyTitle') }}</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div class="text-center card hover-lift">
            <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4 animate-float">
              <span class="text-3xl">🏆</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-capma-blue mb-2">{{ lang.t('why1Title') }}</h3>
            <p class="text-slate-600 text-sm sm:text-base">
              {{ lang.t('why1Desc') }}
            </p>
          </div>

          <div class="text-center card hover-lift">
            <div class="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4 animate-float" style="animation-delay: 0.4s">
              <span class="text-3xl">📚</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-capma-blue mb-2">{{ lang.t('why2Title') }}</h3>
            <p class="text-slate-600 text-sm sm:text-base">
              {{ lang.t('why2Desc') }}
            </p>
          </div>

          <div class="text-center card hover-lift sm:col-span-2 md:col-span-1">
            <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-float" style="animation-delay: 0.8s">
              <span class="text-3xl">🎯</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-capma-blue mb-2">{{ lang.t('why3Title') }}</h3>
            <p class="text-slate-600 text-sm sm:text-base">
              {{ lang.t('why3Desc') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent implements OnInit, OnDestroy {
  certificationLevels: CertificationLevel[] = [];
  authorizedCenters: AuthorizedCenter[] = [];
  certificationSteps: CertificationStep[] = [];
  private subs = new Subscription();

  constructor(
    private certificationDataService: CertificationDataService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.subs.add(this.certificationDataService.getCertificationLevels().subscribe(levels => {
      this.certificationLevels = levels;
    }));

    this.subs.add(this.certificationDataService.getAuthorizedCenters().subscribe(centers => {
      this.authorizedCenters = centers;
    }));

    this.subs.add(this.certificationDataService.getCertificationSteps().subscribe(steps => {
      this.certificationSteps = steps;
    }));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getStepIcon(icon?: string): string {
    switch (icon) {
      case 'upload': return '⬆️';
      case 'shield': return '🛡️';
      case 'payment': return '💳';
      case 'calendar': return '📅';
      case 'pen': return '✏️';
      case 'qr': return '🔲';
      default: return '✔️';
    }
  }
}
