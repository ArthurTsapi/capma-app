import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { ApplyComponent } from './pages/apply.component';
import { DashboardComponent } from './pages/dashboard.component';
import { ExamSimulatorComponent } from './pages/exam-simulator/exam-simulator.component';
import { AdminDashboardComponent } from './pages/admin-dashboard.component';
import { AboutComponent } from './pages/about.component';
import { ContactComponent } from './pages/contact.component';
import { FaqComponent } from './pages/faq.component';
import { TeamComponent } from './pages/team.component';
import { RecertificationComponent } from './pages/recertification.component';
import { LoginComponent } from './pages/login.component';
import { NotFoundComponent } from './pages/not-found.component';
import { authGuardFn } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'apply/:level',
    component: ApplyComponent
  },
  {
    path: 'apply',
    component: ApplyComponent
  },
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    canActivate: [authGuardFn],
    data: { roles: ['candidate', 'admin', 'reviewer'] }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuardFn],
    data: { roles: ['candidate', 'admin', 'reviewer'] }
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuardFn],
    data: { roles: ['admin', 'reviewer'] }
  },
  {
    path: 'exam-simulator',
    component: ExamSimulatorComponent,
    canActivate: [authGuardFn],
    data: { roles: ['candidate', 'admin', 'reviewer'] }
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'recertification',
    component: RecertificationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'certifications',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'centers',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
