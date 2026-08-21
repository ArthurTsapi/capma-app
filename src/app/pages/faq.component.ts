import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 px-4 bg-capma-light-grey">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-capma-blue mb-4">FAQ</h2>
        <div class="space-y-4">
          <details class="card p-4">
            <summary class="font-semibold">{{ lang.t('faq1Q') }}</summary>
            <p class="mt-2 text-sm text-gray-700">{{ lang.t('faq1A') }}</p>
          </details>
          <details class="card p-4">
            <summary class="font-semibold">{{ lang.t('faq2Q') }}</summary>
            <p class="mt-2 text-sm text-gray-700">{{ lang.t('faq2A') }}</p>
          </details>
          <details class="card p-4">
            <summary class="font-semibold">{{ lang.t('faq3Q') }}</summary>
            <p class="mt-2 text-sm text-gray-700">{{ lang.t('faq3A') }}</p>
          </details>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class FaqComponent {
  constructor(public lang: LanguageService) {}
}
