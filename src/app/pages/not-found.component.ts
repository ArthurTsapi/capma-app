import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-capma-navy flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-8xl font-bold text-capma-orange mb-4">404</div>
        <h1 class="text-4xl font-bold text-white mb-2">{{ lang.t('nfTitle') }}</h1>
        <p class="text-gray-300 mb-8">
          {{ lang.t('nfDesc') }}
        </p>
        <a
          routerLink="/"
          class="btn-primary inline-block"
        >
          {{ lang.t('nfBack') }}
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {
  constructor(public lang: LanguageService) {}
}
