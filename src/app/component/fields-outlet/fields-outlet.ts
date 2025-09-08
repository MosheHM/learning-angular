import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FieldConfig {
  name: string;
  label: string;
  input: {
    dataType: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select';
    validation?: {
      required?: boolean;
      maxSize?: number;
      minLength?: number;
      pattern?: string;
      customValidator?: (value: any) => string | null;
    };
  };
  toolTipText?: string;
  // Legacy support for backward compatibility
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface FieldValue {
  [key: string]: any;
}

@Component({
  selector: 'app-fields-outlet',
  imports: [CommonModule],
  templateUrl: './fields-outlet.html',
  styleUrls: ['./fields-outlet.scss']
})
export class FieldsOutletComponent {
  @Input() field: FieldConfig | null = null;
  @Input() title?: string = '';
  @Output() formSubmit = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();

  // Signal for single field value
  private fieldValue = signal<any>('');

  // Helper methods for accessing field properties with backward compatibility
  private getFieldName(): string {
    return this.field?.name || '';
  }

  private getFieldType(): string {
    return this.field?.input?.dataType || 'text';
  }

  private isFieldRequired(): boolean {
    return this.field?.input?.validation?.required || false;
  }

  private getFieldValidation() {
    return this.field?.input?.validation || {};
  }

  // Public methods for template access
  getFieldId(): string {
    return this.getFieldName();
  }

  getFieldTypeForTemplate(): string {
    return this.getFieldType();
  }

  isRequiredForTemplate(): boolean {
    return this.isFieldRequired();
  }

  getPlaceholderText(): string {
    return this.field?.placeholder || this.field?.toolTipText || '';
  }

  // Check if form is valid
  isFormValid(): boolean {
    if (!this.field) return false;
    
    const value = this.getFieldValue();
    // Required fields must have a value
    if (this.isFieldRequired() && (!value || value === '')) {
      return false;
    }
    // If field has a value, it must be valid
    if (value && value !== '') {
      return this.isFieldValid();
    }
    return true;
  }

  // Computed signal for touched field
  private fieldTouched = signal<boolean>(false);

  // Get field value
  getFieldValue(): any {
    return this.fieldValue() || '';
  }

  // Set field value
  setFieldValue(value: any): void {
    this.fieldValue.set(value);

    // Mark field as touched
    this.fieldTouched.set(true);

    // Emit field change event
    this.fieldChange.emit(value);
  }

  // Check if field is valid
  isFieldValid(): boolean {
    if (!this.field) return true;

    const value = this.getFieldValue();
    const validation = this.getFieldValidation();
    const fieldType = this.getFieldType();

    // Required field validation
    if (this.isFieldRequired() && (!value || value === '')) {
      return false;
    }

    // Skip validation if field is not required and empty
    if (!this.isFieldRequired() && (!value || value === '')) {
      return true;
    }

    // Type-specific validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return false;
      }
    }

    // Custom validation
    if (validation.customValidator && value) {
      const customError = validation.customValidator(value);
      if (customError) {
        return false;
      }
    }

    // Length validation
    if (validation.minLength && value && value.length < validation.minLength) {
      return false;
    }

    if (validation.maxSize && value && value.length > validation.maxSize) {
      return false;
    }

    // Pattern validation
    if (validation.pattern && value) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return false;
      }
    }

    return true;
  }

  // Get field error message
  getFieldError(): string | null {
    if (!this.field) return null;

    const value = this.getFieldValue();
    const isTouched = this.fieldTouched();
    const validation = this.getFieldValidation();
    const fieldType = this.getFieldType();

    // Show errors for required fields even if not touched
    if (this.isFieldRequired() && (!value || value === '')) {
      return `${this.field.label} is required`;
    }

    // Only show other errors for touched fields
    if (!isTouched) return null;

    // Type-specific validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Custom validation
    if (validation.customValidator && value) {
      const customError = validation.customValidator(value);
      if (customError) {
        return customError;
      }
    }

    // Length validation
    if (validation.minLength && value && value.length < validation.minLength) {
      return `${this.field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.maxSize && value && value.length > validation.maxSize) {
      return `${this.field.label} must be no more than ${validation.maxSize} characters`;
    }

    // Pattern validation
    if (validation.pattern && value) {
      return `Please enter a valid ${this.field.label.toLowerCase()}`;
    }

    return null;
  }

  // Handle input changes
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.setFieldValue(target.value);
  }

  // Handle form submission
  onSubmit(event: Event): void {
    event.preventDefault();

    // Mark field as touched for validation display
    this.fieldTouched.set(true);

    if (this.isFormValid()) {
      this.formSubmit.emit(this.fieldValue());
    }
  }

  // Mark field as touched (for testing purposes)
  markFieldAsTouched(): void {
    this.fieldTouched.set(true);
  }

  // Reset form
  resetForm(): void {
    this.fieldValue.set('');
    this.fieldTouched.set(false);
  }
}