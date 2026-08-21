import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-10 sm:py-14 px-4 relative overflow-hidden bg-gradient-to-r from-sky-50 via-white to-orange-50">
      <div class="pointer-events-none absolute inset-0 opacity-40" style="background-image: linear-gradient(rgba(30,104,179,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,104,179,0.06) 1px, transparent 1px); background-size: 28px 28px;"></div>
      <div class="relative max-w-6xl mx-auto tech-panel p-6 sm:p-8">
        <div class="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div>
            <h3 class="text-xl sm:text-2xl font-bold text-capma-navy">{{ lang.t('ctaTitle') }}</h3>
            <p class="text-sm text-slate-600 mt-2">{{ lang.t('ctaSubtitle') }}</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <a routerLink="/apply/practitioner" class="btn-primary">{{ lang.t('applyNow') }}</a>
            <a routerLink="/about" class="btn-secondary">{{ lang.t('learnMore') }}</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class CtaComponent {
  constructor(public lang: LanguageService) {}
}
