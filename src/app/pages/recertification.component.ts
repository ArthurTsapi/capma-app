import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-recertification',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-capma-light-grey py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="card p-10">
          <h1 class="text-3xl font-bold text-capma-blue mb-4">{{ lang.t('recertTitle') }}</h1>
          <p class="text-gray-600 mb-8">
            {{ lang.t('recertDesc') }}
          </p>

          <div class="grid gap-6 lg:grid-cols-3">
            <div class="rounded-[30px] bg-white p-6 shadow-sm border border-gray-100">
              <h2 class="font-semibold text-lg mb-3">{{ lang.t('recertCard1Title') }}</h2>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ lang.t('recertCard1Desc') }}
              </p>
            </div>
            <div class="rounded-[30px] bg-white p-6 shadow-sm border border-gray-100">
              <h2 class="font-semibold text-lg mb-3">{{ lang.t('recertCard2Title') }}</h2>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ lang.t('recertCard2Desc') }}
              </p>
            </div>
            <div class="rounded-[30px] bg-white p-6 shadow-sm border border-gray-100">
              <h2 class="font-semibold text-lg mb-3">{{ lang.t('recertCard3Title') }}</h2>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ lang.t('recertCard3Desc') }}
              </p>
            </div>
          </div>

          <div class="mt-10 rounded-[30px] bg-capma-navy text-white p-8">
            <h2 class="text-2xl font-bold mb-4">{{ lang.t('recertCtaTitle') }}</h2>
            <p class="text-gray-200 mb-6">
              {{ lang.t('recertCtaDesc') }}
            </p>
            <a routerLink="/apply" class="inline-flex items-center justify-center rounded-full bg-capma-orange px-6 py-3 font-semibold text-white hover:bg-orange-500 transition-colors">
              {{ lang.t('recertCtaBtn') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RecertificationComponent {
  constructor(public lang: LanguageService) {}
}
