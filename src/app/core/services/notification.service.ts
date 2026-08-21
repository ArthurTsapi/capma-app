import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  dismissible?: boolean;
}

/**
 * Service to manage notifications across the application
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Show success notification
   */
  success(message: string, duration = 3000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'success',
      message,
      duration,
      dismissible: true
    });
  }

  /**
   * Show error notification
   */
  error(message: string, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'error',
      message,
      duration,
      dismissible: true
    });
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration = 4000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      message,
      duration,
      dismissible: true
    });
  }

  /**
   * Show info notification
   */
  info(message: string, duration = 3000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'info',
      message,
      duration,
      dismissible: true
    });
  }

  /**
   * Add a notification
   */
  private addNotification(notification: Notification): void {
    const notifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...notifications, notification]);

    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  /**
   * Remove notification by id
   */
  removeNotification(id: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(notifications);
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Generate unique notification id
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
