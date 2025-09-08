import { Component, Input, Output, EventEmitter, ViewContainerRef, ViewChild, OnChanges, SimpleChanges, ComponentRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldLogicService } from '../../services/field-logic.service';
import { TextFieldComponent } from '../text-field/text-field.component';
import { NumberFieldComponent } from '../number-field/number-field.component';
import { EmailFieldComponent } from '../email-field/email-field.component';
import { TelFieldComponent } from '../tel-field/tel-field.component';
import { BaseFieldComponent } from '../base-field/base-field.component';

export interface FieldConfig {
  name: string;
  label: string;
  input: {
    dataType: 'text' | 'number' | 'email' | 'tel' | 'password' | 'textarea' | 'select';
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
  template: `
    <div class="fields-outlet">
      @if (title) {
        <h2 class="fields-outlet__title">{{ title }}</h2>
      }

      @if (field) {
        <form class="fields-outlet__form" (ngSubmit)="onSubmit($event)">
          <div #fieldContainer></div>

          <div class="fields-outlet__actions">
            <button
              type="submit"
              class="btn btn--primary"
              [disabled]="!isFormValid()"
            >
              Submit
            </button>
            <button
              type="button"
              class="btn btn--secondary"
              (click)="resetForm()"
            >
              Reset
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styleUrls: ['./fields-outlet.scss']
})
export class FieldsOutletComponent implements OnChanges, AfterViewInit {
  @Input() field: FieldConfig | null = null;
  @Input() title?: string = '';
  @Output() formSubmit = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();

  @ViewChild('fieldContainer', { read: ViewContainerRef }) fieldContainer!: ViewContainerRef;

  private fieldLogicService = inject(FieldLogicService);
  private currentFieldComponent: ComponentRef<BaseFieldComponent> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['field'] && this.fieldContainer) {
      this.renderField();
    }
  }

  ngAfterViewInit(): void {
    this.renderField();
  }

  private renderField(): void {
    // Clear previous component
    if (this.currentFieldComponent) {
      this.currentFieldComponent.destroy();
      this.currentFieldComponent = null;
    }

    if (!this.field || !this.fieldContainer) return;

    // Get component type based on field type
    const componentType = this.getComponentType(this.field.input.dataType);
    if (!componentType) return;

    // Create component programmatically
    this.currentFieldComponent = this.fieldContainer.createComponent(componentType);
    
    // Set inputs
    this.currentFieldComponent.instance.field = this.field;
    
    // Subscribe to field changes
    this.currentFieldComponent.instance.fieldChange.subscribe((value: any) => {
      this.fieldChange.emit(value);
    });
  }

  private getComponentType(dataType: string): any {
    switch (dataType) {
      case 'text':
        return TextFieldComponent;
      case 'number':
        return NumberFieldComponent;
      case 'email':
        return EmailFieldComponent;
      case 'tel':
        return TelFieldComponent;
      default:
        return TextFieldComponent; // Fallback to text field
    }
  }

  // Check if form is valid
  isFormValid(): boolean {
    if (!this.field || !this.currentFieldComponent) return false;
    return this.currentFieldComponent.instance.isFieldValid();
  }

  // Get field value
  getFieldValue(): any {
    if (!this.currentFieldComponent) return '';
    return this.currentFieldComponent.instance.getFieldValue();
  }

  // Handle form submission
  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.currentFieldComponent) return;

    // Mark field as touched for validation display
    this.currentFieldComponent.instance.markFieldAsTouched();

    if (this.isFormValid()) {
      this.formSubmit.emit(this.getFieldValue());
    }
  }

  // Reset form
  resetForm(): void {
    if (this.currentFieldComponent) {
      this.currentFieldComponent.instance.resetField();
    }
  }
}