import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FieldsOutletComponent, FieldConfig } from './fields-outlet';

describe('FieldsOutletComponent', () => {
  let component: FieldsOutletComponent;
  let fixture: ComponentFixture<FieldsOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsOutletComponent, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Field Configuration', () => {
    it('should handle text field configuration', () => {
      const field: FieldConfig = {
        name: 'name',
        label: 'Full Name',
        input: {
          dataType: 'text',
          validation: {
            required: true
          }
        },
        toolTipText: 'Enter your name'
      };

      component.field = field;
      fixture.detectChanges();

      expect(component.field).toEqual(field);
    });

    it('should handle different field types', () => {
      const textField: FieldConfig = { 
        name: 'name', 
        label: 'Name', 
        input: { 
          dataType: 'text', 
          validation: { required: true } 
        } 
      };
      component.field = textField;
      fixture.detectChanges();
      expect(component.field.input.dataType).toBe('text');

      const emailField: FieldConfig = { 
        name: 'email', 
        label: 'Email', 
        input: { 
          dataType: 'email', 
          validation: { required: true } 
        } 
      };
      component.field = emailField;
      fixture.detectChanges();
      expect(component.field.input.dataType).toBe('email');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.field = {
        name: 'name',
        label: 'Name',
        input: {
          dataType: 'text',
          validation: {
            required: true,
            minLength: 2,
            maxSize: 50
          }
        }
      };
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      // Initially should be invalid (required field empty)
      expect(component.isFormValid()).toBeFalse();

      // Set value for required field
      component.setFieldValue('John Doe');

      expect(component.isFormValid()).toBeTrue();
    });

    it('should validate email format', () => {
      component.field = {
        name: 'email',
        label: 'Email',
        input: {
          dataType: 'email',
          validation: {
            required: true
          }
        }
      };
      fixture.detectChanges();

      component.setFieldValue('invalid-email');
      component.markFieldAsTouched();

      expect(component.isFieldValid()).toBeFalse();
      expect(component.getFieldError()).toBe('Please enter a valid email address');

      component.setFieldValue('valid@example.com');
      expect(component.isFieldValid()).toBeTrue();
      expect(component.getFieldError()).toBeNull();
    });

    it('should validate minimum length', () => {
      component.setFieldValue('A');
      component.markFieldAsTouched();

      expect(component.isFieldValid()).toBeFalse();
      expect(component.getFieldError()).toBe('Name must be at least 2 characters');

      component.setFieldValue('John');
      expect(component.isFieldValid()).toBeTrue();
    });

    it('should validate maximum length', () => {
      const longName = 'A'.repeat(51);
      component.setFieldValue(longName);
      component.markFieldAsTouched();

      expect(component.isFieldValid()).toBeFalse();
      expect(component.getFieldError()).toBe('Name must be no more than 50 characters');
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      component.field = { 
        name: 'name', 
        label: 'Name', 
        input: { 
          dataType: 'text', 
          validation: { required: true } 
        } 
      };
      fixture.detectChanges();
    });

    it('should emit field change events', () => {
      spyOn(component.fieldChange, 'emit');

      component.setFieldValue('John Doe');

      expect(component.fieldChange.emit).toHaveBeenCalledWith('John Doe');
    });

    it('should emit form submit event when valid', () => {
      spyOn(component.formSubmit, 'emit');

      component.setFieldValue('John Doe');

      // Verify form is valid before submitting
      expect(component.isFormValid()).toBeTrue();

      // Try calling onSubmit directly
      const mockEvent = new Event('submit');
      component.onSubmit(mockEvent);

      expect(component.formSubmit.emit).toHaveBeenCalledWith('John Doe');
    });

    it('should not emit form submit event when invalid', () => {
      spyOn(component.formSubmit, 'emit');

      // Don't set required field value
      const form = fixture.nativeElement.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit'));
      }

      expect(component.formSubmit.emit).not.toHaveBeenCalled();
    });

    it('should reset form', () => {
      component.setFieldValue('John Doe');

      expect(component.getFieldValue()).toBe('John Doe');

      component.resetForm();

      expect(component.getFieldValue()).toBe('');
    });
  });

  describe('Template Rendering', () => {
    it('should render title when provided', () => {
      component.title = 'Test Form';
      component.field = { 
        name: 'name', 
        label: 'Name', 
        input: { dataType: 'text' } 
      };
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.fields-outlet__title');
      expect(titleElement.textContent).toBe('Test Form');
    });

    it('should render required indicator for required fields', () => {
      component.field = { 
        name: 'name', 
        label: 'Name', 
        input: { 
          dataType: 'text', 
          validation: { required: true } 
        } 
      };
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.field-label');
      expect(label.textContent).toContain('*');
    });

    it('should render different input types correctly', () => {
      // Test text input
      component.field = { 
        name: 'text', 
        label: 'Text', 
        input: { dataType: 'text' } 
      };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input[type="text"]')).toBeTruthy();

      // Test email input
      component.field = { 
        name: 'email', 
        label: 'Email', 
        input: { dataType: 'email' } 
      };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input[type="email"]')).toBeTruthy();

      // Test password input
      component.field = { 
        name: 'password', 
        label: 'Password', 
        input: { dataType: 'password' } 
      };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input[type="password"]')).toBeTruthy();

      // Test number input
      component.field = { 
        name: 'number', 
        label: 'Number', 
        input: { dataType: 'number' } 
      };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input[type="number"]')).toBeTruthy();

      // Test textarea
      component.field = { 
        name: 'textarea', 
        label: 'Textarea', 
        input: { dataType: 'textarea' } 
      };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();

      // Test select
      component.field = {
        name: 'select',
        label: 'Select',
        input: { dataType: 'select' },
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('select')).toBeTruthy();
    });

    it('should show error messages for invalid fields', () => {
      component.field = { 
        name: 'email', 
        label: 'Email', 
        input: { 
          dataType: 'email', 
          validation: { required: true } 
        } 
      };
      component.setFieldValue('invalid-email');
      component.markFieldAsTouched();
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.field-error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('Please enter a valid email address');
    });

    it('should disable submit button when form is invalid', () => {
      component.field = { 
        name: 'name', 
        label: 'Name', 
        input: { 
          dataType: 'text', 
          validation: { required: true } 
        } 
      };
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTrue();

      component.setFieldValue('John Doe');
      fixture.detectChanges();

      expect(submitButton.disabled).toBeFalse();
    });

    it('should not render form when no field is provided', () => {
      component.field = null;
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeFalsy();
    });
  });
});