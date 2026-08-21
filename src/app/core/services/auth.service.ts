import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/certification.model';
import { environment } from '../../../environments/environment';

export type UserRole = 'candidate' | 'admin' | 'reviewer';

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User & { passwordHash?: never };
  message?: string;
}

interface StoredAuth {
  token: string;
  user: User;
  issuedAt: number;
}

const STORAGE_KEY = 'capma_auth_v1';
const TOKEN_TTL_MS = 23 * 60 * 60 * 1000;

const DEFAULT_ADMIN: User = {
  id: 'admin-root-0001',
  email: 'admin@capma.cm',
  firstName: 'CaPMA',
  lastName: 'Administrateur',
  phone: '+237 6 00 00 00 01',
  role: 'admin',
  createdAt: new Date(),
  lastLogin: new Date()
};

const DEFAULT_CANDIDATE: User = {
  id: 'user-demo-0001',
  email: 'demo@capma.cm',
  firstName: 'Jean-Pierre',
  lastName: 'Mballa',
  phone: '+237 6 00 00 00 00',
  role: 'candidate',
  createdAt: new Date(),
  lastLogin: new Date()
};

const KNOWN_CREDENTIALS: Record<string, { password: string; user: User }> = {
  'admin@capma.cm': { password: 'Admin@CaPMA2026', user: DEFAULT_ADMIN },
  'demo@capma.cm': { password: 'password1', user: DEFAULT_CANDIDATE }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private readonly isBrowser: boolean;
  private readonly apiBase = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.restoreSession();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getAuthStatusSync(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRoleSync(...roles: UserRole[]): boolean {
    const u = this.currentUserSubject.value;
    if (!u) return false;
    return roles.includes(u.role as UserRole);
  }

  hasRole(...roles: UserRole[]): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(
      map(u => !!u && roles.includes(u.role as UserRole))
    );
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string; user?: User; redirectTo?: string }> {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return of({ success: false, message: 'Email et mot de passe requis' });
    }

    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { email: cleanEmail, password }).pipe(
      switchMap((res: LoginResponse) => this.handleBackendLoginResponse(res, cleanEmail, password)),
      catchError((err: unknown) => this.handleLoginError(err, cleanEmail, password))
    );
  }

  private handleBackendLoginResponse(
    res: LoginResponse,
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string; user?: User; redirectTo?: string }> {
    if (res && res.success && res.token && res.user) {
      const user = res.user as User;
      this.persistAndEmit(res.token, user);
      return of({
        success: true,
        message: 'Connexion réussie',
        user,
        redirectTo: this.redirectForRole(user.role as UserRole)
      });
    }
    return this.handleLoginError(new Error(res?.message || 'Échec authentification'), email, password);
  }

  private handleLoginError(
    err: unknown,
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string; user?: User; redirectTo?: string }> {
    if (environment.features.mockApi) {
      const entry = KNOWN_CREDENTIALS[email];
      if (entry && entry.password === password) {
        const fakeToken = 'mock-' + btoa(`${email}:${Date.now()}`);
        this.persistAndEmit(fakeToken, entry.user);
        return of({
          success: true,
          message: 'Connexion réussie (mode hors ligne)',
          user: entry.user,
          redirectTo: this.redirectForRole(entry.user.role as UserRole)
        });
      }
    }
    let message = 'Identifiants invalides. Vérifiez votre email et votre mot de passe.';
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) message = 'Identifiants invalides';
      else if (err.status === 0) message = 'Serveur indisponible. Vérifiez votre connexion.';
      else if (err.error?.message) message = err.error.message;
    } else if (err instanceof Error && err.message) {
      message = err.message;
    }
    return of({ success: false, message });
  }

  private redirectForRole(role: UserRole): string {
    switch (role) {
      case 'admin':
      case 'reviewer':
        return '/admin';
      case 'candidate':
      default:
        return '/dashboard';
    }
  }

  private persistAndEmit(token: string, user: User): void {
    const auth: StoredAuth = {
      token,
      user,
      issuedAt: Date.now()
    };
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      } catch {
        // Ignore storage errors
      }
    }
  }

  private restoreSession(): void {
    if (!this.isBrowser) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredAuth;
      if (!parsed?.token || !parsed?.user) return;
      if (parsed.issuedAt && Date.now() - parsed.issuedAt > TOKEN_TTL_MS) {
        this.clearStorage();
        return;
      }
      this.currentUserSubject.next(parsed.user);
      this.isAuthenticatedSubject.next(true);
    } catch {
      this.clearStorage();
    }
  }

  register(userData: Partial<User> & { password: string }): Observable<{ success: boolean; message: string; user?: User }> {
    const email = (userData.email || '').trim().toLowerCase();
    if (!email || !userData.password) {
      return of({ success: false, message: 'Email et mot de passe requis' });
    }
    if (userData.password.length < 8) {
      return of({ success: false, message: 'Le mot de passe doit faire au moins 8 caractères' });
    }
    const payload = { ...userData, email, role: 'candidate' as UserRole };
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/register`, payload).pipe(
      map(res => {
        if (res?.success && res.user) {
          return { success: true, message: 'Inscription réussie', user: res.user };
        }
        return { success: false, message: res?.message || "Erreur lors de l'inscription" };
      }),
      catchError(err => {
        const message = err instanceof HttpErrorResponse && err.error?.message
          ? err.error.message
          : "Erreur d'inscription. Réessayez plus tard.";
        return of({ success: false, message });
      })
    );
  }

  logout(): Observable<{ success: boolean }> {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    return of({ success: true });
  }

  private clearStorage(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  getAuthToken(): string | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as StoredAuth;
      if (parsed.issuedAt && Date.now() - parsed.issuedAt > TOKEN_TTL_MS) {
        this.clearStorage();
        return null;
      }
      return parsed.token || null;
    } catch {
      return null;
    }
  }

  refreshToken(): Observable<{ success: boolean; token: string }> {
    const current = this.getAuthToken();
    if (!current) {
      return throwError(() => new Error('Aucune session active'));
    }
    const newToken = current.split('.')[0] + '-' + Date.now();
    const user = this.currentUserSubject.value;
    if (user) this.persistAndEmit(newToken, user);
    return of({ success: true, token: newToken });
  }

  checkAuthStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
