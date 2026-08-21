import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-animated-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative overflow-hidden bg-gradient-to-br from-capma-sky via-white to-[#FFF7F0] py-14 sm:py-20 lg:py-24">
      <div class="pointer-events-none absolute inset-0">
        <div class="tech-orb left-[-4rem] top-10 h-56 w-56 bg-sky-300/40"></div>
        <div class="tech-orb right-[-3rem] top-24 h-64 w-64 bg-orange-200/50" style="animation-delay: 1.2s"></div>
        <div class="tech-orb bottom-0 left-1/3 h-48 w-48 bg-cyan-200/40" style="animation-delay: 0.6s"></div>
        <div
          class="absolute inset-0 opacity-40"
          style="background-image: linear-gradient(rgba(30,104,179,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,104,179,0.08) 1px, transparent 1px); background-size: 40px 40px; animation: grid-pan 18s linear infinite;"
        ></div>
        <div class="tech-scan"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div class="space-y-6 sm:space-y-8 animate-fade-in-left">
          <div class="tech-chip">
            <span class="relative flex h-2.5 w-2.5">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-capma-success-green opacity-60"></span>
              <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-capma-success-green"></span>
            </span>
            {{ lang.t('heroChip') }}
          </div>

          <div class="space-y-4 sm:space-y-6">
            <h1 class="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-tight text-capma-navy">
              {{ lang.t('heroTitlePart1') }}
              <span class="text-capma-blue"> {{ lang.t('heroTitlePart2') }}</span>
            </h1>
            <p class="max-w-xl text-base sm:text-lg text-slate-600">
              {{ lang.t('heroSubtitle') }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a routerLink="/" fragment="certifications" class="btn-primary min-w-0 sm:min-w-[220px]">{{ lang.t('heroCta1') }}</a>
            <a routerLink="/" fragment="centers" class="btn-secondary min-w-0 sm:min-w-[220px]">{{ lang.t('heroCta2') }}</a>
          </div>

          <div class="flex flex-wrap gap-3 pt-2 text-xs sm:text-sm text-slate-500">
            <span class="rounded-full bg-white/90 border border-sky-100 px-3 py-1.5 shadow-sm">{{ lang.t('heroBadge1') }}</span>
            <span class="rounded-full bg-white/90 border border-sky-100 px-3 py-1.5 shadow-sm">{{ lang.t('heroBadge2') }}</span>
            <span class="rounded-full bg-white/90 border border-sky-100 px-3 py-1.5 shadow-sm">{{ lang.t('heroBadge3') }}</span>
          </div>
        </div>

        <div class="relative animate-fade-in-up">
          <div class="absolute -inset-[2px] rounded-[2rem] shimmer-border opacity-70"></div>
          <div class="tech-panel relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="CaPMA training and certification"
              class="relative z-10 h-full w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] object-cover rounded-[1.4rem]"
            />
            <div class="absolute z-20 bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
              <div class="rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 px-4 py-3 shadow-lg animate-float">
                <p class="text-xs uppercase tracking-wider text-capma-orange font-semibold">{{ lang.t('heroLive') }}</p>
                <p class="text-sm font-semibold text-capma-navy">{{ lang.t('heroLiveDesc') }}</p>
              </div>
            </div>
            <div class="absolute z-20 top-4 right-4 h-3 w-3 rounded-full bg-capma-blue animate-orbit"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class AnimatedHeroComponent {
  constructor(public lang: LanguageService) {}
}
