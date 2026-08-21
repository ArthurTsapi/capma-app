import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 px-4">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-capma-blue mb-4">{{ lang.t('contactTitle') }}</h2>
        <p class="text-gray-700 mb-6">{{ lang.t('contactDesc') }}</p>

        <div class="card p-6">
          <form class="space-y-4">
            <div>
              <label class="text-sm font-semibold text-gray-700">{{ lang.t('contactName') }}</label>
              <input class="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-700">{{ lang.t('contactEmail') }}</label>
              <input class="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-700">{{ lang.t('contactMessage') }}</label>
              <textarea class="w-full px-4 py-2 border rounded" rows="6"></textarea>
            </div>
            <div class="text-right">
              <button class="btn-primary">{{ lang.t('contactSend') }}</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class ContactComponent {
  constructor(public lang: LanguageService) {}
}
