import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification, NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      <div
        *ngFor="let notification of notifications"
        class="p-4 rounded-lg shadow-lg animate-fadeIn"
        [ngClass]="getNotificationClass(notification.type)"
      >
        <div class="flex justify-between items-start gap-3">
          <div class="flex-1">
            <p class="font-semibold">{{ getNotificationTitle(notification.type) }}</p>
            <p class="text-sm mt-1">{{ notification.message }}</p>
          </div>
          <button
            *ngIf="notification.dismissible"
            (click)="dismissNotification(notification.id)"
            class="flex-shrink-0 text-xl leading-none opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  dismissNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-capma-success-green text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-capma-orange text-white';
      case 'info':
        return 'bg-capma-blue text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  }

  getNotificationTitle(type: string): string {
    switch (type) {
      case 'success':
        return '✓ Succès';
      case 'error':
        return '✕ Erreur';
      case 'warning':
        return '⚠ Avertissement';
      case 'info':
        return 'ℹ Information';
      default:
        return 'Notification';
    }
  }
}
