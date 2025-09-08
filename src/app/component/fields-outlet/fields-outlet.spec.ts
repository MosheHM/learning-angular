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
        layout: { sectionId: 'leftSection', order: 1 },
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
        layout: { sectionId: 'leftSection', order: 1 },
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
        layout: { sectionId: 'leftSection', order: 2 },
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



});