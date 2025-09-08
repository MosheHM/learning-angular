import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FieldConfig {
  id: string;
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customValidator?: (value: any) => string | null;
  };
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
  @Input() fields: FieldConfig[] = [];
  @Input() title?: string = '';
  @Output() formSubmit = new EventEmitter<FieldValue>();
  @Output() fieldChange = new EventEmitter<{ fieldId: string; value: any }>();

  // Signal for form values
  private formValues = signal<FieldValue>({});

  // Check if form is valid
  isFormValid(): boolean {
    return this.fields.every(field => {
      const value = this.getFieldValue(field.id);
      // Required fields must have a value
      if (field.required && (!value || value === '')) {
        return false;
      }
      // If field has a value, it must be valid
      if (value && value !== '') {
        return this.isFieldValid(field.id);
      }
      return true;
    });
  }

  // Computed signal for touched fields
  private touchedFields = signal<Set<string>>(new Set());

  // Get field value
  getFieldValue(fieldId: string): any {
    return this.formValues()[fieldId] || '';
  }

  // Set field value
  setFieldValue(fieldId: string, value: any): void {
    this.formValues.update(values => ({
      ...values,
      [fieldId]: value
    }));

    // Mark field as touched
    this.touchedFields.update(touched => new Set([...touched, fieldId]));

    // Emit field change event
    this.fieldChange.emit({ fieldId, value });
  }

  // Check if field is valid
  isFieldValid(fieldId: string): boolean {
    const field = this.fields.find(f => f.id === fieldId);
    if (!field) return true;

    const value = this.getFieldValue(fieldId);

    // Required field validation
    if (field.required && (!value || value === '')) {
      return false;
    }

    // Skip validation if field is not required and empty
    if (!field.required && (!value || value === '')) {
      return true;
    }

    // Type-specific validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return false;
      }
    }

    // Custom validation
    if (field.validation?.customValidator && value) {
      const customError = field.validation.customValidator(value);
      if (customError) {
        return false;
      }
    }

    // Length validation
    if (field.validation?.minLength && value && value.length < field.validation.minLength) {
      return false;
    }

    if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
      return false;
    }

    // Pattern validation
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return false;
      }
    }

    return true;
  }

  // Get field error message
  getFieldError(fieldId: string): string | null {
    const field = this.fields.find(f => f.id === fieldId);
    if (!field) return null;

    const value = this.getFieldValue(fieldId);
    const isTouched = this.touchedFields().has(fieldId);

    // Show errors for required fields even if not touched
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    // Only show other errors for touched fields
    if (!isTouched) return null;

    // Type-specific validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Custom validation
    if (field.validation?.customValidator && value) {
      const customError = field.validation.customValidator(value);
      if (customError) {
        return customError;
      }
    }

    // Length validation
    if (field.validation?.minLength && value && value.length < field.validation.minLength) {
      return `${field.label} must be at least ${field.validation.minLength} characters`;
    }

    if (field.validation?.maxLength && value && value.length > field.validation.maxLength) {
      return `${field.label} must be no more than ${field.validation.maxLength} characters`;
    }

    // Pattern validation
    if (field.validation?.pattern && value) {
      return `Please enter a valid ${field.label.toLowerCase()}`;
    }

    return null;
  }

  // Handle input changes
  onFieldChange(fieldId: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.setFieldValue(fieldId, target.value);
  }

  // Handle form submission
  onSubmit(event: Event): void {
    event.preventDefault();

    // Mark all fields as touched for validation display
    this.touchedFields.update(touched =>
      new Set([...touched, ...this.fields.map(f => f.id)])
    );

    if (this.isFormValid()) {
      this.formSubmit.emit(this.formValues());
    }
  }

  // Mark field as touched (for testing purposes)
  markFieldAsTouched(fieldId: string): void {
    this.touchedFields.update(touched => new Set([...touched, fieldId]));
  }

  // Reset form
  resetForm(): void {
    this.formValues.set({});
    this.touchedFields.set(new Set());
  }
}