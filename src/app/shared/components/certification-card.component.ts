import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CertificationLevel } from '../../core/models/certification.model';
import { LanguageService } from '../../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-certification-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="rounded-[30px] overflow-hidden shadow-xl bg-white border border-gray-100 h-full flex flex-col">
      <div class="px-6 py-8 relative" [ngClass]="getTopSectionClasses()">
        <div class="absolute top-5 right-5" *ngIf="level.badge">
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            <span class="h-2 w-2 rounded-full bg-white"></span>
            {{ level.badge }}
          </span>
        </div>

        <div>
          <h3 class="text-xl font-semibold">{{ level.title }}</h3>
          <p class="text-sm opacity-80 mt-2">{{ lang.t('cardPrerequisite') }}&nbsp;: {{ getPrerequisiteLabel() }}</p>
        </div>

        <div class="mt-8">
          <p class="text-4xl font-extrabold leading-tight">{{ level.totalFee | number }}</p>
          <p class="text-sm uppercase tracking-[0.3em] opacity-80">FCFA</p>
        </div>
      </div>

      <div class="p-6 flex-1 flex flex-col">
        <p class="text-sm text-gray-600 mb-4">
          <span class="font-semibold">{{ lang.t('cardTargetPublic') }}&nbsp;:</span> {{ level.targetPublic }}
        </p>

        <ul class="space-y-3 mb-6 text-sm text-gray-600">
          <li *ngFor="let feature of level.features" class="flex items-start gap-3">
            <span class="mt-1 text-capma-success-green">✓</span>
            <span>{{ feature }}</span>
          </li>
        </ul>

        <div class="rounded-3xl bg-capma-light-grey p-4 mb-6">
          <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>{{ lang.t('cardRegistration') }}</span>
            <span class="font-semibold text-gray-900">{{ level.registrationFee | number }} FCFA</span>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>{{ lang.t('cardExam') }}</span>
            <span class="font-semibold text-gray-900">{{ level.examFee | number }} FCFA</span>
          </div>
          <div class="border-t border-gray-200 pt-3 flex items-center justify-between text-sm font-semibold text-gray-900">
            <span>{{ lang.t('cardTotal') }}</span>
            <span [ngClass]="getTotalClass()">{{ level.totalFee | number }} FCFA</span>
          </div>
        </div>

        <button [routerLink]="'/apply/' + level.id" class="mt-auto rounded-full py-3 text-sm font-semibold transition-colors" [ngClass]="getButtonClasses()">
          {{ lang.t('cardApply') }}
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class CertificationCardComponent implements OnInit, OnDestroy {
  @Input() level!: CertificationLevel;
  private subs = new Subscription();

  constructor(public lang: LanguageService) {}

  ngOnInit(): void {}
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  getTopSectionClasses(): string {
    if (this.level.color === 'orange') return 'bg-capma-orange text-slate-950';
    if (this.level.color === 'green') return 'bg-capma-success-green text-white';
    return 'bg-capma-navy text-white';
  }

  getButtonClasses(): string {
    if (this.level.color === 'orange') return 'bg-capma-orange text-slate-950 hover:bg-orange-500';
    if (this.level.color === 'green') return 'bg-capma-success-green text-white hover:bg-emerald-600';
    return 'bg-capma-navy text-white hover:bg-slate-800';
  }

  getTotalClass(): string {
    if (this.level.color === 'orange') return 'text-capma-orange';
    if (this.level.color === 'green') return 'text-capma-success-green';
    return 'text-slate-900';
  }

  getPrerequisiteLabel(): string {
    switch (this.level.id) {
      case 'foundation': return this.lang.t('prereqNone');
      case 'practitioner': return this.lang.t('prereq2y');
      case 'professional': return this.lang.t('prereq5y');
      case 'master': return this.lang.t('prereq10y');
      default: return this.level.prerequisites[0] || '';
    }
  }
}
