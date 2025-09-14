import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submit-button.html',
  styleUrls: ['./submit-button.scss']
})
export class SubmitButtonComponent {
  @Input() label: string = 'Submit';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';

  @Output() submitClick = new EventEmitter<void>();

  onSubmit(): void {
    if (!this.disabled && !this.loading) {
      this.submitClick.emit();
    }
  }
}