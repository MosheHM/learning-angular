import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, ComponentRef, inject, AfterViewInit } from '@angular/core';
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
  layout?: {
    sectionId?: string;
    order?: number;
  };
  input: {
    dataType: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
    validation?: {
      required?: boolean;
      maxSize?: number;
      minLength?: number;
      pattern?: string;
      customValidator?: (value: any) => string | null;
    };
  };
  toolTipText?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface FieldValue {
  [key: string]: any;
}

@Component({
  selector: 'app-field-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './field-container.component.html',
  styleUrls: ['./field-container.component.scss']
})
export class FieldContainerComponent implements OnChanges, AfterViewInit {
  @Input() field: FieldConfig | null = null;
  @Input() title?: string;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() fieldChange = new EventEmitter<any>();

  @ViewChild('fieldContainer', { read: ViewContainerRef }) fieldContainer!: ViewContainerRef;

  private fieldLogic = inject(FieldLogicService);
  private currentFieldComponent: ComponentRef<BaseFieldComponent> | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['field'] && !changes['field'].firstChange) {
      this.renderField();
    }
  }

  ngAfterViewInit() {
    this.renderField();
  }

  private renderField() {
    if (!this.fieldContainer) return;
    // Destroy previous
    if (this.currentFieldComponent) {
      this.currentFieldComponent.destroy();
      this.currentFieldComponent = null;
    }

    if (!this.field) return;

    const type = this.field.input?.dataType || 'text';
    const compType = this.getComponentType(type);
    this.fieldContainer.clear();
    const compRef = this.fieldContainer.createComponent(compType);
    compRef.instance.field = this.field;
    compRef.instance.fieldChange.subscribe((v: any) => this.fieldChange.emit(v));
    this.currentFieldComponent = compRef as ComponentRef<BaseFieldComponent>;
  }

  private getComponentType(dataType: string) {
    switch (dataType) {
      case 'number':
        return NumberFieldComponent;
      case 'email':
        return EmailFieldComponent;
      case 'tel':
        return TelFieldComponent;
      default:
        return TextFieldComponent;
    }
  }

  isFormValid(): boolean {
    return !!(this.currentFieldComponent && this.currentFieldComponent.instance.isFieldValid());
  }

  getFieldValue(): any {
    return this.currentFieldComponent ? this.currentFieldComponent.instance.getFieldValue() : '';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.currentFieldComponent) this.currentFieldComponent.instance.markFieldAsTouched();
    if (this.isFormValid()) this.formSubmit.emit(this.getFieldValue());
  }

  resetForm() {
    if (this.currentFieldComponent) this.currentFieldComponent.instance.resetField();
  }

  // Expose current error message (if any) for template
  get errorMessage(): string | null {
    if (!this.currentFieldComponent) return null;
    // assume BaseFieldComponent has getFieldError()
    // @ts-ignore - some field components may implement getFieldError
    return (this.currentFieldComponent.instance as any).getFieldError ? (this.currentFieldComponent.instance as any).getFieldError() : null;
  }
}
