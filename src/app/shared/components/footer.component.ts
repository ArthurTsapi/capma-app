import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="mt-12 sm:mt-16 border-t border-sky-100 bg-gradient-to-b from-white to-capma-sky text-slate-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="/assets/capma-logo.jpeg"
              alt="CaPMA"
              class="block h-14 w-auto max-w-[240px] object-contain object-left mb-4"
            />
            <p class="text-slate-600 text-sm leading-relaxed">
              {{ lang.t('footerDesc') }}
            </p>
          </div>

          <div>
            <h3 class="text-base font-bold mb-4 text-capma-blue">{{ lang.t('footerContact') }}</h3>
            <div class="text-slate-600 text-sm space-y-2">
              <p><strong class="text-slate-800">{{ lang.t('footerHq') }}</strong><br>Akwa, Douala</p>
              <a routerLink="/contact" class="block text-capma-orange hover:text-capma-blue transition-colors">contact&#64;capma.cm</a>
              <a href="tel:+237600000000" class="block hover:text-capma-orange transition-colors">+237 6 00 00 00 00</a>
            </div>
          </div>

          <div>
            <h3 class="text-base font-bold mb-4 text-capma-blue">{{ lang.t('footerInstitution') }}</h3>
            <ul class="text-slate-600 text-sm space-y-2">
              <li><a routerLink="/about" class="hover:text-capma-orange transition-colors">{{ lang.t('footerWho') }}</a></li>
              <li><a routerLink="/about" fragment="valeurs" class="hover:text-capma-orange transition-colors">{{ lang.t('footerOurValues') }}</a></li>
              <li><a routerLink="/team" class="hover:text-capma-orange transition-colors">{{ lang.t('footerGovernance') }}</a></li>
              <li><a routerLink="/faq" class="hover:text-capma-orange transition-colors">{{ lang.t('footerFaq') }}</a></li>
              <li><a routerLink="/contact" class="hover:text-capma-orange transition-colors">{{ lang.t('footerContactUs') }}</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-base font-bold mb-4 text-capma-blue">{{ lang.t('footerCertifications') }}</h3>
            <ul class="text-slate-600 text-sm space-y-2">
              <li><a routerLink="/apply/foundation" class="hover:text-capma-orange transition-colors">PME Foundation</a></li>
              <li><a routerLink="/apply/practitioner" class="hover:text-capma-orange transition-colors">PME Practitioner</a></li>
              <li><a routerLink="/apply/professional" class="hover:text-capma-orange transition-colors">PME Professional</a></li>
              <li><a routerLink="/apply/master" class="hover:text-capma-orange transition-colors">PME Master</a></li>
              <li><a routerLink="/recertification" class="hover:text-capma-orange transition-colors">{{ lang.t('footerRecertification') }}</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-sky-200 pt-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>{{ lang.t('footerCopyright') }}</p>
            <div class="flex flex-wrap justify-center gap-4 md:gap-6">
              <a routerLink="/faq" class="hover:text-capma-orange transition-colors">{{ lang.t('footerLegal') }}</a>
              <a routerLink="/contact" class="hover:text-capma-orange transition-colors">{{ lang.t('footerPrivacy') }}</a>
              <a routerLink="/about" class="hover:text-capma-orange transition-colors">{{ lang.t('footerTerms') }}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  constructor(public lang: LanguageService) {}
}
