import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { ApplicationService } from '../core/services/application.service';
import { NotificationService } from '../core/services/notification.service';
import { LanguageService } from '../core/services/language.service';
import {
  CandidateApplication,
  ApplicationStatus,
  PaymentStatus,
  CertificationLevel,
  AuthorizedCenter
} from '../core/models/certification.model';
import { CertificationDataService } from '../core/services/certification-data.service';

type AdminTab = 'overview' | 'applications' | 'payments' | 'documents' | 'candidates' | 'exams';

interface StatCard {
  label: string;
  value: number | string;
  delta?: string;
  color: 'blue' | 'orange' | 'green' | 'red' | 'slate';
  icon: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50">
      <header class="bg-gradient-to-r from-capma-navy via-capma-blue to-[#2B7BC7] text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-sky-100">
                PANEL ADMINISTRATEUR
              </span>
              <span class="inline-flex items-center gap-1.5 text-xs font-medium text-sky-100/80">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connecté
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1">
              Tableau de bord — CaPMA Certification
            </h1>
            <p class="text-sm text-sky-100/80">
              Bienvenue, <strong>{{ currentUser?.firstName }} {{ currentUser?.lastName }}</strong>
              <span class="mx-2 text-white/40">·</span>
              {{ currentDateTime }}
            </p>
          </div>
          <div class="flex items-center gap-2 sm:gap-3">
            <a routerLink="/" class="px-4 py-2 rounded-xl border border-white/20 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              ← Retour site
            </a>
            <button
              type="button"
              (click)="onLogout()"
              class="px-4 py-2 rounded-xl bg-capma-orange/90 hover:bg-capma-orange text-sm font-semibold text-white shadow-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div class="flex flex-wrap gap-2 -mb-2">
            @for (tab of adminTabs; track tab.key) {
              <button
                type="button"
                (click)="activeTab = tab.key"
                class="relative px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all"
                [ngClass]="activeTab === tab.key
                  ? 'bg-slate-50 text-capma-blue shadow-inner'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'"
              >
                <span class="mr-2">{{ tab.icon }}</span>
                {{ tab.label }}
                @if (tab.count && tab.count > 0) {
                  <span class="ml-2 inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-[0.65rem] font-bold"
                    [ngClass]="activeTab === tab.key ? 'bg-capma-orange text-white' : 'bg-white/20 text-white'">
                    {{ tab.count }}
                  </span>
                }
              </button>
            }
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @switch (activeTab) {
          @case ('overview') {
            <section class="mb-10">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                @for (card of statCards; track card.label) {
                  <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between gap-3 mb-3">
                      <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        [ngClass]="{
                          'bg-blue-100 text-capma-blue': card.color === 'blue',
                          'bg-orange-100 text-capma-orange': card.color === 'orange',
                          'bg-emerald-100 text-emerald-700': card.color === 'green',
                          'bg-red-100 text-red-700': card.color === 'red',
                          'bg-slate-100 text-slate-700': card.color === 'slate'
                        }">
                        {{ card.icon }}
                      </div>
                      @if (card.delta) {
                        <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {{ card.delta }}
                        </span>
                      }
                    </div>
                    <p class="text-2xl font-bold text-slate-900 mb-0.5">{{ card.value }}</p>
                    <p class="text-xs text-slate-500 font-medium uppercase tracking-wide">{{ card.label }}</p>
                  </div>
                }
              </div>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
              <div class="lg:col-span-2 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 class="font-bold text-slate-900">Demandes récentes</h3>
                  <button type="button" (click)="activeTab = 'applications'" class="text-xs font-semibold text-capma-blue hover:text-capma-orange">
                    Voir tout →
                  </button>
                </div>
                <div class="divide-y divide-slate-50">
                  @for (app of recentApplications; track app.id) {
                    <div class="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/60 transition-colors">
                      <div class="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-capma-blue/20 to-capma-orange/20 flex items-center justify-center font-bold text-sm text-capma-blue">
                        {{ app.firstName.charAt(0) }}{{ app.lastName.charAt(0) }}
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-sm text-slate-900 truncate">
                          {{ app.firstName }} {{ app.lastName }}
                        </p>
                        <p class="text-xs text-slate-500 truncate">
                          {{ app.email }} · {{ levelLabel(app.selectedLevelId) }} · {{ app.city }}
                        </p>
                      </div>
                      <span class="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold"
                        [ngClass]="statusClasses(app.status)">
                        {{ statusLabel(app.status) }}
                      </span>
                    </div>
                  }
                  @if (recentApplications.length === 0) {
                    <div class="px-5 py-10 text-center text-sm text-slate-400">
                      Aucune candidature pour le moment.
                    </div>
                  }
                </div>
              </div>

              <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100">
                  <h3 class="font-bold text-slate-900">Revenus estimés</h3>
                  <p class="text-xs text-slate-500 mt-0.5">Paiements validés (simulé)</p>
                </div>
                <div class="p-5">
                  <p class="text-4xl font-extrabold text-slate-900 mb-1">
                    {{ totalRevenueFcfa | number }}
                    <span class="text-base text-slate-400 font-semibold ml-1">FCFA</span>
                  </p>
                  <div class="mt-5 space-y-3">
                    @for (row of revenueByLevel; track row.label) {
                      <div>
                        <div class="flex justify-between text-xs mb-1">
                          <span class="font-semibold text-slate-600">{{ row.label }}</span>
                          <span class="text-slate-500">{{ row.count }} · {{ row.amount | number }} FCFA</span>
                        </div>
                        <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div class="h-full rounded-full bg-gradient-to-r from-capma-blue to-capma-orange transition-all duration-700"
                            [style.width.%]="row.percent"></div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100">
                  <h3 class="font-bold text-slate-900">Répartition par statut</h3>
                </div>
                <div class="p-5 grid grid-cols-2 gap-3">
                  @for (s of statusDistribution; track s.key) {
                    <div class="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <div class="flex items-center justify-between mb-1">
                        <span class="inline-flex items-center w-2.5 h-2.5 rounded-full"
                          [style.background]="s.dot"></span>
                        <span class="text-[0.68rem] font-bold text-slate-500 uppercase tracking-wide">{{ s.key }}</span>
                      </div>
                      <p class="text-xl font-bold text-slate-900">{{ s.count }}</p>
                      <p class="text-[0.7rem] text-slate-500 mt-0.5">{{ s.label }}</p>
                    </div>
                  }
                </div>
              </div>

              <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100">
                  <h3 class="font-bold text-slate-900">Actions rapides</h3>
                </div>
                <div class="p-5 grid grid-cols-2 gap-3">
                  <button type="button" (click)="activeTab = 'applications'; statusFilter = 'under_review'"
                    class="rounded-xl border border-slate-100 p-4 text-left hover:bg-blue-50 hover:border-blue-200 transition-colors">
                    <div class="text-2xl mb-1">⏳</div>
                    <p class="text-sm font-bold text-slate-900">Valider dossiers</p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ countByStatus('under_review') }} en attente</p>
                  </button>
                  <button type="button" (click)="activeTab = 'payments'; paymentFilter = 'pending'"
                    class="rounded-xl border border-slate-100 p-4 text-left hover:bg-orange-50 hover:border-orange-200 transition-colors">
                    <div class="text-2xl mb-1">💳</div>
                    <p class="text-sm font-bold text-slate-900">Paiements en attente</p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ countByPayment('pending') }} à confirmer</p>
                  </button>
                  <button type="button" (click)="activeTab = 'documents'"
                    class="rounded-xl border border-slate-100 p-4 text-left hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                    <div class="text-2xl mb-1">📄</div>
                    <p class="text-sm font-bold text-slate-900">Documents à vérifier</p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ documentsToReview }} à examiner</p>
                  </button>
                  <button type="button" (click)="activeTab = 'exams'"
                    class="rounded-xl border border-slate-100 p-4 text-left hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                    <div class="text-2xl mb-1">🎯</div>
                    <p class="text-sm font-bold text-slate-900">Sessions d'examen</p>
                    <p class="text-xs text-slate-500 mt-0.5">{{ convokedCount }} candidats convoqués</p>
                  </button>
                </div>
              </div>
            </section>
          }

          @case ('applications') {
            <section class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 class="font-bold text-slate-900">Toutes les candidatures</h3>
                  <p class="text-xs text-slate-500 mt-0.5">{{ filteredApplications.length }} résultats</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <input type="text" [ngModel]="searchQuery" (ngModelChange)="searchQuery = $any($event)"
                    placeholder="Rechercher (nom, email, ville)..."
                    class="px-3 py-2 rounded-xl border border-slate-200 text-sm w-full sm:w-64 focus:border-capma-blue focus:outline-none focus:ring-2 focus:ring-capma-blue/15" />
                  <select [(ngModel)]="statusFilter"
                    class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:border-capma-blue focus:outline-none">
                    <option value="">Tous les statuts</option>
                    @for (s of allStatuses; track s.key) {
                      <option [value]="s.key">{{ s.label }}</option>
                    }
                  </select>
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th class="px-5 py-3 text-left font-semibold">Candidat</th>
                      <th class="px-5 py-3 text-left font-semibold">Niveau</th>
                      <th class="px-5 py-3 text-left font-semibold">Centre / Ville</th>
                      <th class="px-5 py-3 text-left font-semibold">Statut</th>
                      <th class="px-5 py-3 text-left font-semibold">Paiement</th>
                      <th class="px-5 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    @for (app of filteredApplications; track app.id) {
                      <tr class="hover:bg-slate-50/60">
                        <td class="px-5 py-3">
                          <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-capma-blue/20 to-capma-orange/20 flex items-center justify-center font-bold text-xs text-capma-blue">
                              {{ app.firstName.charAt(0) }}{{ app.lastName.charAt(0) }}
                            </div>
                            <div class="min-w-0">
                              <p class="font-semibold text-slate-900 truncate">{{ app.firstName }} {{ app.lastName }}</p>
                              <p class="text-xs text-slate-500 truncate">{{ app.email }} · {{ app.phone }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-5 py-3 text-slate-700 font-medium">
                          {{ levelLabel(app.selectedLevelId) }}
                        </td>
                        <td class="px-5 py-3 text-slate-600 text-xs">
                          <p>{{ app.city }}</p>
                          <p class="text-slate-400">{{ centerLabel(app.preferredCenterId) }}</p>
                        </td>
                        <td class="px-5 py-3">
                          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold"
                            [ngClass]="statusClasses(app.status)">
                            {{ statusLabel(app.status) }}
                          </span>
                        </td>
                        <td class="px-5 py-3">
                          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold"
                            [ngClass]="paymentClasses(app.paymentStatus)">
                            {{ paymentLabel(app.paymentStatus) }}
                          </span>
                        </td>
                        <td class="px-5 py-3 text-right">
                          <div class="inline-flex items-center gap-1.5">
                            @if (app.status === 'under_review' || app.status === 'approved') {
                              <button type="button" (click)="approveApplication(app.id)"
                                class="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 border border-emerald-100">
                                ✓ Approuver tout
                              </button>
                            }
                            @if (app.status === 'paid') {
                              <button type="button" (click)="convokeApplication(app.id)"
                                class="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 border border-indigo-100">
                                📄 Convoquer
                              </button>
                            }
                            <button type="button" (click)="openAppDetails(app)"
                              class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-capma-blue bg-blue-50 hover:bg-blue-100 border border-blue-100">
                              Détails
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                    @if (filteredApplications.length === 0) {
                      <tr>
                        <td colspan="6" class="px-5 py-14 text-center text-slate-400 text-sm">
                          Aucune candidature ne correspond aux filtres.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          @case ('payments') {
            <section class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 class="font-bold text-slate-900">Paiements</h3>
                  <p class="text-xs text-slate-500 mt-0.5">Total : {{ totalRevenueFcfa | number }} FCFA</p>
                </div>
                <select [(ngModel)]="paymentFilter"
                  class="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:border-capma-blue focus:outline-none">
                  <option value="">Tous les paiements</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Validés</option>
                  <option value="failed">Échoués</option>
                </select>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th class="px-5 py-3 text-left font-semibold">Candidat</th>
                      <th class="px-5 py-3 text-left font-semibold">Niveau</th>
                      <th class="px-5 py-3 text-left font-semibold">Montant</th>
                      <th class="px-5 py-3 text-left font-semibold">Statut</th>
                      <th class="px-5 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    @for (app of paymentFiltered; track app.id) {
                      <tr class="hover:bg-slate-50/60">
                        <td class="px-5 py-3 font-medium text-slate-900">
                          {{ app.firstName }} {{ app.lastName }}
                        </td>
                        <td class="px-5 py-3 text-slate-600">{{ levelLabel(app.selectedLevelId) }}</td>
                        <td class="px-5 py-3 font-semibold text-slate-900">
                          {{ levelFee(app.selectedLevelId) | number }} FCFA
                        </td>
                        <td class="px-5 py-3">
                          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold"
                            [ngClass]="paymentClasses(app.paymentStatus)">
                            {{ paymentLabel(app.paymentStatus) }}
                          </span>
                        </td>
                        <td class="px-5 py-3 text-right">
                          @if (app.paymentStatus !== 'completed') {
                            <button type="button" (click)="markPaymentCompleted(app.id)"
                              class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 border border-emerald-100">
                              ✓ Marquer payé
                            </button>
                          }
                        </td>
                      </tr>
                    }
                    @if (paymentFiltered.length === 0) {
                      <tr>
                        <td colspan="5" class="px-5 py-14 text-center text-slate-400 text-sm">
                          Aucun paiement dans cette catégorie.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          @case ('documents') {
            <section class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100">
                <h3 class="font-bold text-slate-900">Vérification des documents</h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ documentsToReview }} dossier(s) nécessitent une vérification documentaire
                </p>
              </div>
              <div class="divide-y divide-slate-50">
                @for (app of applicationsWithDocs; track app.id) {
                  <div class="px-5 py-4">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <div class="flex items-center gap-3 flex-1 min-w-0">
                        <div class="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-capma-blue/20 to-capma-orange/20 flex items-center justify-center font-bold text-sm text-capma-blue">
                          {{ app.firstName.charAt(0) }}{{ app.lastName.charAt(0) }}
                        </div>
                        <div class="min-w-0">
                          <p class="font-semibold text-slate-900 truncate">{{ app.firstName }} {{ app.lastName }}</p>
                          <p class="text-xs text-slate-500 truncate">
                            {{ levelLabel(app.selectedLevelId) }} · {{ app.email }}
                          </p>
                        </div>
                      </div>
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold self-start sm:self-auto"
                        [ngClass]="statusClasses(app.status)">
                        {{ statusLabel(app.status) }}
                      </span>
                    </div>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                      <ng-container [ngTemplateOutlet]="docChip"
                        [ngTemplateOutletContext]="{ $implicit: { label: 'CV', url: app.documents.cvUrl, type: 'cv', id: app.id } }"></ng-container>
                      <ng-container [ngTemplateOutlet]="docChip"
                        [ngTemplateOutletContext]="{ $implicit: { label: 'Diplôme', url: app.documents.diplomaUrl, type: 'diploma', id: app.id } }"></ng-container>
                      <ng-container [ngTemplateOutlet]="docChip"
                        [ngTemplateOutletContext]="{ $implicit: { label: 'CNI/Passeport', url: app.documents.idCardUrl, type: 'idCard', id: app.id } }"></ng-container>
                      <ng-container [ngTemplateOutlet]="docChip"
                        [ngTemplateOutletContext]="{ $implicit: { label: 'Attestation Exp.', url: app.documents.experienceCertUrl, type: 'experienceCert', id: app.id } }"></ng-container>
                    </div>
                  </div>
                }
                @if (applicationsWithDocs.length === 0) {
                  <div class="px-5 py-14 text-center text-slate-400 text-sm">
                    Aucun document pour le moment.
                  </div>
                }
              </div>
            </section>
          }

          @case ('candidates') {
            <section class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 class="font-bold text-slate-900">Candidats enregistrés</h3>
                  <p class="text-xs text-slate-500 mt-0.5">
                    {{ distinctCandidates }} candidat(s) · {{ applications.length }} candidature(s)
                  </p>
                </div>
                <button type="button" (click)="notifyInfo('Génération de mots de passe candidats : fonction à connecter au backend d\\'envoi d\\'emails/SMS')"
                  class="px-3 py-2 rounded-xl bg-capma-blue text-white text-xs font-semibold shadow-sm hover:bg-[#195796]">
                  🔐 Envoyer identifiants (simulé)
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th class="px-5 py-3 text-left font-semibold">Identité</th>
                      <th class="px-5 py-3 text-left font-semibold">Email</th>
                      <th class="px-5 py-3 text-left font-semibold">Téléphone</th>
                      <th class="px-5 py-3 text-left font-semibold">Ville</th>
                      <th class="px-5 py-3 text-center font-semibold">Statut accès</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    @for (c of candidatesList; track c.email) {
                      <tr class="hover:bg-slate-50/60">
                        <td class="px-5 py-3 font-semibold text-slate-900">
                          {{ c.firstName }} {{ c.lastName }}
                        </td>
                        <td class="px-5 py-3 text-slate-600">{{ c.email }}</td>
                        <td class="px-5 py-3 text-slate-600">{{ c.phone || '—' }}</td>
                        <td class="px-5 py-3 text-slate-600">{{ c.city || '—' }}</td>
                        <td class="px-5 py-3 text-center">
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Identifiants système générés
                          </span>
                        </td>
                      </tr>
                    }
                    @if (candidatesList.length === 0) {
                      <tr>
                        <td colspan="5" class="px-5 py-14 text-center text-slate-400 text-sm">
                          Aucun candidat enregistré.
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }

          @case ('exams') {
            <section class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
              <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Candidats convoqués</p>
                <p class="text-3xl font-extrabold text-slate-900">{{ convokedCount }}</p>
              </div>
              <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Examens complétés</p>
                <p class="text-3xl font-extrabold text-slate-900">{{ countByStatus('exam_completed') }}</p>
              </div>
              <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Certifiés délivrés</p>
                <p class="text-3xl font-extrabold text-slate-900">{{ countByStatus('certified') }}</p>
              </div>
            </section>

            <section class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-5 py-4 border-b border-slate-100">
                <h3 class="font-bold text-slate-900">Sessions d'examen</h3>
              </div>
              <div class="divide-y divide-slate-50">
                @for (app of convokedOrDoneApplications; track app.id) {
                  <div class="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-slate-900 truncate">{{ app.firstName }} {{ app.lastName }}</p>
                      <p class="text-xs text-slate-500 truncate">
                        {{ levelLabel(app.selectedLevelId) }}
                        @if (app.examScore !== undefined && app.examScore !== null) {
                          <span class="mx-1.5">·</span>
                          Score : <strong class="text-slate-700">{{ app.examScore }}%</strong>
                        }
                      </p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[0.7rem] font-semibold self-start sm:self-auto"
                      [ngClass]="statusClasses(app.status)">
                      {{ statusLabel(app.status) }}
                    </span>
                  </div>
                }
                @if (convokedOrDoneApplications.length === 0) {
                  <div class="px-5 py-14 text-center text-slate-400 text-sm">
                    Aucune session d'examen pour le moment.
                  </div>
                }
              </div>
            </section>
          }
        }
      </main>
    </div>

    <ng-template #docChip let-doc>
      <div class="flex items-center justify-between gap-2 rounded-xl border p-3"
        [ngClass]="doc.url
          ? 'border-emerald-100 bg-emerald-50/40'
          : 'border-slate-200 bg-slate-50 text-slate-400'">
        <div class="min-w-0">
          <p class="text-[0.7rem] uppercase tracking-wide font-bold text-slate-500">{{ doc.label }}</p>
          <p class="text-xs truncate" [ngClass]="doc.url ? 'text-emerald-700 font-medium' : 'text-slate-400 italic'">
            {{ doc.url ? (doc.url | slice:0:28) + '…' : 'Non fourni' }}
          </p>
        </div>
        <button
          type="button"
          [disabled]="!doc.url"
          (click)="doc.url && approveDocument(doc.id, doc.type)"
          class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[0.7rem] font-bold transition-colors"
          [ngClass]="doc.url
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'">
          ✓
        </button>
      </div>
    </ng-template>
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  currentUser = this.auth.getCurrentUserSync();
  currentDateTime = new Date().toLocaleString('fr-FR');

  activeTab: AdminTab = 'overview';
  searchQuery = '';
  statusFilter: ApplicationStatus | '' = '';
  paymentFilter: PaymentStatus | '' = '';

  applications: CandidateApplication[] = [];
  levels: CertificationLevel[] = [];
  centers: AuthorizedCenter[] = [];

  readonly adminTabs: { key: AdminTab; label: string; icon: string; count?: number }[] = [
    { key: 'overview', label: 'Vue globale', icon: '📊' },
    { key: 'applications', label: 'Candidatures', icon: '📝', count: 0 },
    { key: 'payments', label: 'Paiements', icon: '💳', count: 0 },
    { key: 'documents', label: 'Documents', icon: '📄', count: 0 },
    { key: 'candidates', label: 'Candidats', icon: '👥' },
    { key: 'exams', label: 'Examens', icon: '🎯' }
  ];

  readonly allStatuses: { key: ApplicationStatus; label: string }[] = [
    { key: 'submitted', label: 'Soumis' },
    { key: 'under_review', label: 'En validation' },
    { key: 'approved', label: 'Approuvé' },
    { key: 'paid', label: 'Payé' },
    { key: 'convoked', label: 'Convoqué' },
    { key: 'exam_completed', label: 'Examen terminé' },
    { key: 'certified', label: 'Certifié' },
    { key: 'rejected', label: 'Rejeté' }
  ];

  constructor(
    public auth: AuthService,
    private applicationService: ApplicationService,
    private certData: CertificationDataService,
    private notifications: NotificationService,
    public lang: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.add(this.applicationService.getApplications().subscribe(apps => {
      this.applications = apps;
      this.refreshTabCounts();
    }));
    this.subs.add(this.certData.getCertificationLevels().subscribe(l => (this.levels = l)));
    this.subs.add(this.certData.getAuthorizedCenters().subscribe(c => (this.centers = c)));

    setInterval(() => {
      this.currentDateTime = new Date().toLocaleString('fr-FR');
    }, 30_000);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private refreshTabCounts(): void {
    this.adminTabs[1].count = this.applications.length;
    this.adminTabs[2].count = this.countByPayment('pending');
    this.adminTabs[3].count = this.documentsToReview;
  }

  get statCards(): StatCard[] {
    return [
      { label: 'Total candidatures', value: this.applications.length, delta: '+12%', color: 'blue', icon: '📝' },
      { label: 'En attente de validation', value: this.countByStatus('under_review'), delta: 'À traiter', color: 'orange', icon: '⏳' },
      { label: 'Payements validés', value: this.countByPayment('completed'), color: 'green', icon: '💳' },
      { label: 'Candidats certifiés', value: this.countByStatus('certified'), color: 'slate', icon: '🏆' }
    ];
  }

  get recentApplications(): CandidateApplication[] {
    return [...this.applications]
      .sort((a, b) => +new Date(b.appliedAt) - +new Date(a.appliedAt))
      .slice(0, 6);
  }

  get totalRevenueFcfa(): number {
    return this.applications
      .filter(a => a.paymentStatus === 'completed')
      .reduce((sum, a) => sum + this.levelFee(a.selectedLevelId), 0);
  }

  get revenueByLevel(): { label: string; count: number; amount: number; percent: number }[] {
    const totals: Record<string, { count: number; amount: number }> = {};
    for (const a of this.applications.filter(a => a.paymentStatus === 'completed')) {
      const fee = this.levelFee(a.selectedLevelId);
      const key = a.selectedLevelId;
      if (!totals[key]) totals[key] = { count: 0, amount: 0 };
      totals[key].count += 1;
      totals[key].amount += fee;
    }
    const total = this.totalRevenueFcfa || 1;
    return this.levels.map(l => ({
      label: l.title,
      count: totals[l.id]?.count || 0,
      amount: totals[l.id]?.amount || 0,
      percent: Math.round(((totals[l.id]?.amount || 0) / total) * 100)
    }));
  }

  get statusDistribution(): { key: string; label: string; count: number; dot: string }[] {
    return this.allStatuses.map(s => ({
      key: s.key,
      label: s.label,
      count: this.countByStatus(s.key),
      dot: this.statusDot(s.key)
    }));
  }

  get filteredApplications(): CandidateApplication[] {
    const q = (this.searchQuery || '').trim().toLowerCase();
    return this.applications.filter(a => {
      if (this.statusFilter && a.status !== this.statusFilter) return false;
      if (!q) return true;
      return (
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
      );
    });
  }

  get paymentFiltered(): CandidateApplication[] {
    return this.applications.filter(a => {
      if (!this.paymentFilter) return true;
      return a.paymentStatus === this.paymentFilter;
    });
  }

  get applicationsWithDocs(): CandidateApplication[] {
    return this.applications.filter(a =>
      a.documents?.cvUrl ||
      a.documents?.diplomaUrl ||
      a.documents?.idCardUrl ||
      a.documents?.experienceCertUrl
    );
  }

  get documentsToReview(): number {
    return this.applications.filter(a =>
      (a.status === 'submitted' || a.status === 'under_review') &&
      (a.documents?.cvUrl || a.documents?.diplomaUrl || a.documents?.idCardUrl || a.documents?.experienceCertUrl)
    ).length;
  }

  get convokedCount(): number {
    return this.countByStatus('convoked');
  }

  get convokedOrDoneApplications(): CandidateApplication[] {
    return this.applications.filter(a =>
      a.status === 'convoked' || a.status === 'exam_completed' || a.status === 'certified'
    );
  }

  get distinctCandidates(): number {
    const set = new Set(this.applications.map(a => a.email));
    return set.size;
  }

  get candidatesList(): { firstName: string; lastName: string; email: string; phone?: string; city?: string }[] {
    const map = new Map<string, { firstName: string; lastName: string; email: string; phone?: string; city?: string }>();
    for (const a of this.applications) {
      if (!map.has(a.email)) {
        map.set(a.email, {
          firstName: a.firstName,
          lastName: a.lastName,
          email: a.email,
          phone: a.phone,
          city: a.city
        });
      }
    }
    return Array.from(map.values());
  }

  countByStatus(status: ApplicationStatus): number {
    return this.applications.filter(a => a.status === status).length;
  }

  countByPayment(status: PaymentStatus): number {
    return this.applications.filter(a => a.paymentStatus === status).length;
  }

  levelLabel(id: string): string {
    return this.levels.find(l => l.id === id)?.title || id;
  }

  levelFee(id: string): number {
    return this.levels.find(l => l.id === id)?.totalFee || 0;
  }

  centerLabel(id: string): string {
    const c = this.centers.find(cc => cc.id === id);
    return c ? `${c.city} — ${c.location}` : id;
  }

  statusLabel(s: ApplicationStatus): string {
    return this.allStatuses.find(x => x.key === s)?.label || s;
  }

  statusClasses(s: ApplicationStatus): string {
    switch (s) {
      case 'submitted':
      case 'approved':
      case 'certified':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'under_review':
      case 'paid':
        return 'bg-blue-50 text-capma-blue border border-blue-100';
      case 'convoked':
      case 'exam_completed':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-100';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  private statusDot(s: ApplicationStatus): string {
    switch (s) {
      case 'submitted':
      case 'approved':
      case 'certified':
        return '#10B981';
      case 'under_review':
      case 'paid':
        return '#1E68B3';
      case 'convoked':
      case 'exam_completed':
        return '#F59E0B';
      case 'rejected':
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  }

  paymentLabel(s: PaymentStatus): string {
    switch (s) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'completed': return 'Validé';
      case 'failed': return 'Échoué';
    }
  }

  paymentClasses(s: PaymentStatus): string {
    switch (s) {
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'processing':
        return 'bg-blue-50 text-capma-blue border border-blue-100';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'failed':
        return 'bg-red-50 text-red-700 border border-red-100';
    }
  }

  approveApplication(id: string): void {
    this.applicationService.approveAll(id).subscribe(app => {
      if (app) {
        this.notifications.success(`Dossier de ${app.firstName} ${app.lastName} approuvé, payé et convoqué.`);
      }
    });
  }

  convokeApplication(id: string): void {
    this.applicationService.updateApplicationStatus(id, 'convoked').subscribe(app => {
      if (app) {
        this.notifications.success(`${app.firstName} ${app.lastName} a été convoqué(e) à l'examen.`);
      }
    });
  }

  markPaymentCompleted(id: string): void {
    this.applicationService.updatePaymentStatus(id, 'completed').subscribe(app => {
      if (app) {
        this.notifications.success(`Paiement validé pour ${app.firstName} ${app.lastName}.`);
      }
    });
  }

  openAppDetails(app: CandidateApplication): void {
    this.notifyInfo(
      `Détails candidature ${app.id} — ${app.firstName} ${app.lastName}\nStatut : ${this.statusLabel(app.status)}\nPaiement : ${this.paymentLabel(app.paymentStatus)}`
    );
  }

  approveDocument(id: string, _type: string): void {
    this.applicationService.updateApplicationStatus(id, 'under_review').subscribe(app => {
      if (app) {
        this.notifications.success(`Document vérifié pour ${app.firstName} ${app.lastName}.`);
      }
    });
  }

  notifyInfo(message: string): void {
    this.notifications.info(message);
  }

  onLogout(): void {
    this.subs.add(
      this.auth.logout().subscribe({
        complete: () => {
          this.notifications.success('Vous avez été déconnecté.');
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
