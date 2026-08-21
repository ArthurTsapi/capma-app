import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="min-h-screen bg-capma-light-grey flex items-center justify-center px-4 py-10">
      <section class="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 sm:p-10">
        <a routerLink="/login" class="text-sm text-capma-blue hover:text-capma-orange">Retour à la connexion</a>
        <h1 class="mt-5 text-3xl font-bold text-capma-navy">Créer un compte candidat</h1>
        <p class="mt-2 text-sm text-gray-500">Vos informations seront enregistrées dans MongoDB.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="mt-8 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input formControlName="firstName" placeholder="Prénom" class="field" />
            <input formControlName="lastName" placeholder="Nom" class="field" />
          </div>
          <input formControlName="email" type="email" placeholder="Email" class="field" />
          <input formControlName="phone" type="tel" placeholder="Téléphone" class="field" />
          <input formControlName="city" placeholder="Ville" class="field" />
          <input formControlName="password" type="password" placeholder="Mot de passe (8 caractères minimum)" class="field" />
          <p *ngIf="error" class="text-sm text-red-600">{{ error }}</p>
          <button type="submit" [disabled]="form.invalid || submitting" class="w-full rounded-2xl bg-capma-blue px-5 py-3 font-semibold text-white disabled:opacity-50">
            {{ submitting ? 'Création...' : 'Créer mon compte' }}
          </button>
        </form>
      </section>
    </main>
  `,
  styles: [`.field { width: 100%; border: 1px solid #dbe2ea; border-radius: 1rem; padding: .85rem 1rem; outline: none; } .field:focus { border-color: #1E68B3; box-shadow: 0 0 0 3px rgb(30 104 179 / 12%); }`]
})
export class RegisterComponent {
  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    city: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';
    this.auth.register(this.form.getRawValue() as { firstName: string; lastName: string; email: string; phone: string; city: string; password: string })
      .subscribe(response => {
        this.submitting = false;
        if (response.success) {
          this.router.navigate(['/login'], { queryParams: { registered: '1' } });
        } else {
          this.error = response.message;
        }
      });
  }
}
