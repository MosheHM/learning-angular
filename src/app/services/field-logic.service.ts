import { Injectable, signal } from '@angular/core';
import type { FieldConfig } from '../types/page.types';

export interface FieldState {
  value: any;
  touched: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FieldLogicService {
  
  // Validation methods
  isFieldRequired(field: FieldConfig): boolean {
    return field.input?.validation?.required || false;
  }

  getFieldValidation(field: FieldConfig) {
    return field.input?.validation || {};
  }

  validateEmail(value: string): boolean {
    if (!value) return true; // Empty values are handled by required validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  validateTel(value: string): boolean {
    if (!value) return true; // Empty values are handled by required validation
    // Basic phone number validation - allows numbers, spaces, dashes, parentheses, plus
    const telRegex = /^[\+]?[\d\s\-\(\)]+$/;
    return telRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  }

  // Field validation logic
  isFieldValid(field: FieldConfig | null, value: any, touched: boolean = false): boolean {
    if (!field) return true;

    const validation = this.getFieldValidation(field);
    const fieldType = field.input?.dataType || 'text';

    // Required field validation
    if (this.isFieldRequired(field) && (!value || value === '')) {
      return false;
    }

    // Skip validation if field is not required and empty
    if (!this.isFieldRequired(field) && (!value || value === '')) {
      return true;
    }

    // Type-specific validation
    if (fieldType === 'email' && value) {
      if (!this.validateEmail(value)) {
        return false;
      }
    }

    if (fieldType === 'tel' && value) {
      if (!this.validateTel(value)) {
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
  getFieldError(field: FieldConfig | null, value: any, touched: boolean): string | null {
    if (!field) return null;

    const validation = this.getFieldValidation(field);
    const fieldType = field.input?.dataType || 'text';

    // Show errors for required fields even if not touched
    if (this.isFieldRequired(field) && (!value || value === '')) {
      return `${field.label} is required`;
    }

    // Only show other errors for touched fields
    if (!touched) return null;

    // Type-specific validation
    if (fieldType === 'email' && value) {
      if (!this.validateEmail(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (fieldType === 'tel' && value) {
      if (!this.validateTel(value)) {
        return 'Please enter a valid phone number';
      }
    }


    // Length validation
    if (validation.minLength && value && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }

    if (validation.maxSize && value && value.length > validation.maxSize) {
      return `${field.label} must be no more than ${validation.maxSize} characters`;
    }

    // Pattern validation
    if (validation.pattern && value) {
      return `Please enter a valid ${field.label.toLowerCase()}`;
    }

    return null;
  }

  // Helper methods for field properties
  getFieldName(field: FieldConfig | null): string {
    return field?.name || '';
  }

  getFieldType(field: FieldConfig | null): string {
    return field?.input?.dataType || 'text';
  }

  getPlaceholderText(field: FieldConfig | null): string {
    return field?.placeholder || field?.toolTipText || '';
  }
}