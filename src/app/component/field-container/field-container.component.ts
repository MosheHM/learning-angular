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

@Component({
  selector: 'app-field-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './field-container.component.html',
  styleUrls: ['./field-container.component.scss']
})
export class FieldContainerComponent {
  @Input() field: FieldConfig | null = null;
 
  @Output() fieldChange = new EventEmitter<any>();

  // Simple form submit handler used by template
  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.field) return;
    // Emit a change event so parent can react; payload can be extended later
    this.fieldChange.emit({ name: this.field.name });
  }
}
