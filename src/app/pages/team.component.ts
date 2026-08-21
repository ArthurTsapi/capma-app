import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapRevealDirective } from '../shared/directives/gsap-reveal.directive';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, GsapRevealDirective],
  template: `
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-capma-blue mb-4">{{ lang.t('teamTitle') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6 text-center" gsapReveal>
            <img src="/assets/images/team1.jpg" alt="" class="mx-auto rounded-full w-24 h-24 mb-3" />
            <h3 class="font-bold">{{ lang.t('team1Name') }}</h3>
            <p class="text-sm text-gray-600">{{ lang.t('team1Role') }}</p>
          </div>
          <div class="card p-6 text-center" gsapReveal>
            <img src="/assets/images/team2.jpg" alt="" class="mx-auto rounded-full w-24 h-24 mb-3" />
            <h3 class="font-bold">{{ lang.t('team2Name') }}</h3>
            <p class="text-sm text-gray-600">{{ lang.t('team2Role') }}</p>
          </div>
          <div class="card p-6 text-center" gsapReveal>
            <img src="/assets/images/team3.jpg" alt="" class="mx-auto rounded-full w-24 h-24 mb-3" />
            <h3 class="font-bold">{{ lang.t('team3Name') }}</h3>
            <p class="text-sm text-gray-600">{{ lang.t('team3Role') }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class TeamComponent {
  constructor(public lang: LanguageService) {}
}
