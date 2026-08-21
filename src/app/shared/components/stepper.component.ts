import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationStep } from '../../core/models/certification.model';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-8">
      <div class="flex justify-between items-center">
        <ng-container *ngFor="let step of steps; let i = index">
          <!-- Step Item -->
          <div class="flex items-center flex-1" [ngClass]="{ 'pr-4': i < steps.length - 1 }">
            <!-- Circle -->
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all"
              [ngClass]="getStepClass(step)"
            >
              {{ step.id }}
            </div>

            <!-- Label -->
            <div class="ml-3 flex-1">
              <p class="text-sm font-semibold" [ngClass]="getTextColor(step)">
                {{ step.title }}
              </p>
              <p class="text-xs text-gray-500">{{ step.description }}</p>
              <p *ngIf="step.estimatedDuration" class="text-xs text-gray-400 mt-1">
                {{ step.estimatedDuration }}
              </p>
            </div>
          </div>

          <!-- Connector Line -->
          <div
            *ngIf="i < steps.length - 1"
            class="h-0.5 flex-1 mx-4"
            [ngClass]="
              isStepCompleted(step)
                ? 'bg-capma-success-green'
                : 'bg-gray-300'
            "
          ></div>
        </ng-container>
      </div>
    </div>
  `,
  styles: []
})
export class StepperComponent {
  @Input() steps: CertificationStep[] = [];
  @Input() currentStep: number = 1;
  @Input() completedSteps: number[] = [];

  getStepClass(step: CertificationStep): string {
    if (this.completedSteps.includes(step.id)) {
      return 'bg-capma-success-green';
    }
    if (step.id === this.currentStep) {
      return 'bg-capma-orange';
    }
    if (step.id < this.currentStep) {
      return 'bg-capma-blue';
    }
    return 'bg-gray-300';
  }

  getTextColor(step: CertificationStep): string {
    if (step.id === this.currentStep) {
      return 'text-capma-orange';
    }
    if (this.completedSteps.includes(step.id) || step.id < this.currentStep) {
      return 'text-capma-blue';
    }
    return 'text-gray-400';
  }

  isStepCompleted(step: CertificationStep): boolean {
    return this.completedSteps.includes(step.id);
  }
}
