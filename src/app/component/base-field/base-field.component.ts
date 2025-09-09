import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldConfig } from '../field-container/field-container';
import { FieldLogicService } from '../../services/field-logic.service';

@Component({
  selector: 'app-base-field',
  template: '',
  standalone: true,
  imports: [CommonModule]
})
export abstract class BaseFieldComponent {
  @Input() field: FieldConfig | null = null;
  @Output() fieldChange = new EventEmitter<any>();

  protected fieldLogicService = inject(FieldLogicService);
  protected fieldValue = signal<any>('');
  protected fieldTouched = signal<boolean>(false);

  // Get field value
  getFieldValue(): any {
    return this.fieldValue() || '';
  }

  // Set field value
  setFieldValue(value: any): void {
    this.fieldValue.set(value);
    this.fieldTouched.set(true);
    this.fieldChange.emit(value);
  }

  // Helper methods for template access
  getFieldId(): string {
    return this.fieldLogicService.getFieldName(this.field);
  }

  isRequired(): boolean {
    return this.field ? this.fieldLogicService.isFieldRequired(this.field) : false;
  }

  getPlaceholderText(): string {
    return this.fieldLogicService.getPlaceholderText(this.field);
  }

  isFieldValid(): boolean {
    return this.fieldLogicService.isFieldValid(this.field, this.getFieldValue(), this.fieldTouched());
  }

  getFieldError(): string | null {
    return this.fieldLogicService.getFieldError(this.field, this.getFieldValue(), this.fieldTouched());
  }

  // Handle input changes
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.setFieldValue(target.value);
  }

  // Mark field as touched
  markFieldAsTouched(): void {
    this.fieldTouched.set(true);
  }

  // Reset field
  resetField(): void {
    this.fieldValue.set('');
    this.fieldTouched.set(false);
  }
}