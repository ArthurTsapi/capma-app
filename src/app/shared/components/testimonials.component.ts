import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapRevealDirective } from '../../shared/directives/gsap-reveal.directive';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, GsapRevealDirective],
  template: `
    <section class="py-12 sm:py-16 px-4 bg-white">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold text-capma-blue text-center mb-8">{{ lang.t('testimonialsTitle') }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          <div class="card p-5 sm:p-6 hover-lift" gsapReveal>
            <p class="text-slate-700 mb-4 text-sm sm:text-base">"{{ lang.t('t1Quote') }}"</p>
            <p class="font-semibold text-capma-blue">{{ lang.t('t1Name') }}</p>
            <p class="text-xs text-slate-500">{{ lang.t('t1Role') }}</p>
          </div>

          <div class="card p-5 sm:p-6 hover-lift" gsapReveal>
            <p class="text-slate-700 mb-4 text-sm sm:text-base">"{{ lang.t('t2Quote') }}"</p>
            <p class="font-semibold text-capma-blue">{{ lang.t('t2Name') }}</p>
            <p class="text-xs text-slate-500">{{ lang.t('t2Role') }}</p>
          </div>

          <div class="card p-5 sm:p-6 hover-lift sm:col-span-2 md:col-span-1" gsapReveal>
            <p class="text-slate-700 mb-4 text-sm sm:text-base">"{{ lang.t('t3Quote') }}"</p>
            <p class="font-semibold text-capma-blue">{{ lang.t('t3Name') }}</p>
            <p class="text-xs text-slate-500">{{ lang.t('t3Role') }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class TestimonialsComponent {
  constructor(public lang: LanguageService) {}
}
