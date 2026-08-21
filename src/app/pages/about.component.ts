import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapRevealDirective } from '../shared/directives/gsap-reveal.directive';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, GsapRevealDirective],
  template: `
    <section class="py-16 px-4 bg-capma-light-grey">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-capma-blue mb-4">{{ lang.t('aboutTitle') }}</h2>
        <p class="text-gray-700 mb-6">{{ lang.t('aboutDesc') }}</p>

        <div id="valeurs" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6 animate-fade-in-up" gsapReveal>
            <h3 class="font-bold text-capma-blue mb-2">{{ lang.t('aboutMission') }}</h3>
            <p class="text-sm text-gray-600">{{ lang.t('aboutMissionDesc') }}</p>
          </div>

          <div class="card p-6 animate-fade-in-up" gsapReveal>
            <h3 class="font-bold text-capma-blue mb-2">{{ lang.t('aboutValues') }}</h3>
            <p class="text-sm text-gray-600">{{ lang.t('aboutValuesDesc') }}</p>
          </div>

          <div class="card p-6 animate-fade-in-up" gsapReveal>
            <h3 class="font-bold text-capma-blue mb-2">{{ lang.t('aboutPartners') }}</h3>
            <p class="text-sm text-gray-600">{{ lang.t('aboutPartnersDesc') }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class AboutComponent {
  constructor(public lang: LanguageService) {}
}
