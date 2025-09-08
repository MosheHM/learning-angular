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
      const fields: FieldConfig[] = [
        {
          id: 'name',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your name',
          required: true
        }
      ];

      component.fields = fields;
      fixture.detectChanges();

      expect(component.fields).toEqual(fields);
    });

    it('should handle multiple field types', () => {
      const fields: FieldConfig[] = [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true },
        { id: 'age', type: 'number', label: 'Age' },
        { id: 'password', type: 'password', label: 'Password', required: true },
        { id: 'bio', type: 'textarea', label: 'Bio' },
        {
          id: 'country',
          type: 'select',
          label: 'Country',
          options: [
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' }
          ]
        }
      ];

      component.fields = fields;
      fixture.detectChanges();

      expect(component.fields.length).toBe(6);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.fields = [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          validation: { minLength: 2, maxLength: 50 }
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          required: true
        }
      ];
      fixture.detectChanges();
    });

    it('should validate required fields', () => {
      // Initially should be invalid (required fields empty)
      expect(component.isFormValid()).toBeFalse();

      // Set values for required fields
      component.setFieldValue('name', 'John Doe');
      component.setFieldValue('email', 'john@example.com');

      expect(component.isFormValid()).toBeTrue();
    });

    it('should validate email format', () => {
      component.setFieldValue('email', 'invalid-email');
      component.markFieldAsTouched('email');

      expect(component.isFieldValid('email')).toBeFalse();
      expect(component.getFieldError('email')).toBe('Please enter a valid email address');

      component.setFieldValue('email', 'valid@example.com');
      expect(component.isFieldValid('email')).toBeTrue();
      expect(component.getFieldError('email')).toBeNull();
    });

    it('should validate minimum length', () => {
      component.setFieldValue('name', 'A');
      component.markFieldAsTouched('name');

      expect(component.isFieldValid('name')).toBeFalse();
      expect(component.getFieldError('name')).toBe('Name must be at least 2 characters');

      component.setFieldValue('name', 'John');
      expect(component.isFieldValid('name')).toBeTrue();
    });

    it('should validate maximum length', () => {
      const longName = 'A'.repeat(51);
      component.setFieldValue('name', longName);
      component.markFieldAsTouched('name');

      expect(component.isFieldValid('name')).toBeFalse();
      expect(component.getFieldError('name')).toBe('Name must be no more than 50 characters');
    });
  });

  describe('Form Interactions', () => {
    beforeEach(() => {
      component.fields = [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email', required: true }
      ];
      fixture.detectChanges();
    });

    it('should emit field change events', () => {
      spyOn(component.fieldChange, 'emit');

      component.setFieldValue('name', 'John Doe');

      expect(component.fieldChange.emit).toHaveBeenCalledWith({
        fieldId: 'name',
        value: 'John Doe'
      });
    });

    it('should emit form submit event when valid', () => {
      spyOn(component.formSubmit, 'emit');

      component.setFieldValue('name', 'John Doe');
      component.setFieldValue('email', 'john@example.com');

      // Verify form is valid before submitting
      expect(component.isFormValid()).toBeTrue();

      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();

      // Try calling onSubmit directly instead of dispatching event
      const mockEvent = new Event('submit');
      component.onSubmit(mockEvent);

      expect(component.formSubmit.emit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
    });

    it('should not emit form submit event when invalid', () => {
      spyOn(component.formSubmit, 'emit');

      // Don't set required field values
      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));

      expect(component.formSubmit.emit).not.toHaveBeenCalled();
    });

    it('should reset form', () => {
      component.setFieldValue('name', 'John Doe');
      component.setFieldValue('email', 'john@example.com');

      expect(component.getFieldValue('name')).toBe('John Doe');
      expect(component.getFieldValue('email')).toBe('john@example.com');

      component.resetForm();

      expect(component.getFieldValue('name')).toBe('');
      expect(component.getFieldValue('email')).toBe('');
    });
  });

  describe('Template Rendering', () => {
    it('should render title when provided', () => {
      component.title = 'Test Form';
      component.fields = [{ id: 'name', type: 'text', label: 'Name' }];
      fixture.detectChanges();

      const titleElement = fixture.nativeElement.querySelector('.fields-outlet__title');
      expect(titleElement.textContent).toBe('Test Form');
    });

    it('should render required indicator for required fields', () => {
      component.fields = [
        { id: 'name', type: 'text', label: 'Name', required: true },
        { id: 'email', type: 'email', label: 'Email' }
      ];
      fixture.detectChanges();

      const labels = fixture.nativeElement.querySelectorAll('.field-label');
      expect(labels[0].textContent).toContain('*');
      expect(labels[1].textContent).not.toContain('*');
    });

    it('should render different input types correctly', () => {
      component.fields = [
        { id: 'text', type: 'text', label: 'Text' },
        { id: 'email', type: 'email', label: 'Email' },
        { id: 'password', type: 'password', label: 'Password' },
        { id: 'number', type: 'number', label: 'Number' },
        { id: 'textarea', type: 'textarea', label: 'Textarea' },
        {
          id: 'select',
          type: 'select',
          label: 'Select',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
          ]
        }
      ];
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('input[type="text"]')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('input[type="email"]')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('input[type="password"]')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('input[type="number"]')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('select')).toBeTruthy();
    });

    it('should show error messages for invalid fields', () => {
      component.fields = [
        { id: 'email', type: 'email', label: 'Email', required: true }
      ];
      component.setFieldValue('email', 'invalid-email');
      component.markFieldAsTouched('email');
      fixture.detectChanges();

      const errorElement = fixture.nativeElement.querySelector('.field-error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('Please enter a valid email address');
    });

    it('should disable submit button when form is invalid', () => {
      component.fields = [
        { id: 'name', type: 'text', label: 'Name', required: true }
      ];
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTrue();

      component.setFieldValue('name', 'John Doe');
      fixture.detectChanges();

      expect(submitButton.disabled).toBeFalse();
    });
  });
});