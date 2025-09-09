import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, ComponentRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../text-input/text-input.component';
import { NumberInputComponent } from '../number-input/number-input.component';


export interface FieldConfig {
  name: string;
  label: string;
  layout?: {
    sectionId?: string;
    order?: number;
  };
  input: {
    dataType: string;
    validation?: {
      required?: boolean;
      maxSize?: number;
      minLength?: number;
      pattern?: string;
    };
  };
  toolTipText?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

@Component({
  selector: 'app-field-container',
  standalone: true,
  imports: [CommonModule, TextInputComponent, NumberInputComponent],
  templateUrl: './field-container.component.html',
  styleUrls: ['./field-container.component.scss']
})
export class FieldContainerComponent {
  @Input() field: FieldConfig | null = null;
  @Output() fieldChange = new EventEmitter<any>();

}
