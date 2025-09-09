import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldLogicService } from './field-logic.service';
import type { FieldConfig } from '../component/field-container/field-container.component';

describe('FieldLogicService', () => {
  let service: FieldLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Field validation', () => {
    it('should validate required fields', () => {
      const field: FieldConfig = {
        name: 'test',
        label: 'Test',
        input: {
          dataType: 'text',
          validation: { required: true }
        }
      };

      expect(service.isFieldValid(field, '', false)).toBeFalse();
      expect(service.isFieldValid(field, 'value', false)).toBeTrue();
    });

    it('should validate email fields', () => {
      const field: FieldConfig = {
        name: 'email',
        label: 'Email',
        input: {
          dataType: 'email',
          validation: { required: true }
        }
      };

      expect(service.validateEmail('invalid-email')).toBeFalse();
      expect(service.validateEmail('valid@example.com')).toBeTrue();
      expect(service.validateEmail('')).toBeTrue(); // Empty is handled by required validation
    });

    it('should validate tel fields', () => {
      const field: FieldConfig = {
        name: 'phone',
        label: 'Phone',
        input: {
          dataType: 'tel',
          validation: { required: true }
        }
      };

      expect(service.validateTel('123456789')).toBeFalse(); // Too short
      expect(service.validateTel('1234567890')).toBeTrue(); // Valid 10 digits
      expect(service.validateTel('+1 (234) 567-8900')).toBeTrue(); // Valid formatted
      expect(service.validateTel('')).toBeTrue(); // Empty is handled by required validation
    });

    it('should provide appropriate error messages', () => {
      const emailField: FieldConfig = {
        name: 'email',
        label: 'Email',
        input: {
          dataType: 'email',
          validation: { required: true }
        }
      };

      expect(service.getFieldError(emailField, '', false)).toBe('Email is required');
      expect(service.getFieldError(emailField, 'invalid', true)).toBe('Please enter a valid email address');
      expect(service.getFieldError(emailField, 'valid@example.com', true)).toBeNull();
    });
  });
});