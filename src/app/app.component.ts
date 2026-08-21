import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { NotificationsComponent } from './shared/components/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NotificationsComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-notifications></app-notifications>
    <app-footer></app-footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'CaPMA Certification PME';
}
