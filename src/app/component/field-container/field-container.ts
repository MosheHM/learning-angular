import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, ComponentRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { TextInputComponent } from '../text-input/text-input';
import { NumberInputComponent } from '../number-input/number-input';
import { FieldConfig } from '../../types/page.types';

@Component({
  selector: 'app-field-container',
  standalone: true,
  imports: [CommonModule, TextInputComponent, NumberInputComponent],
  templateUrl: './field-container.html',
  styleUrls: ['./field-container.scss']
})
export class FieldContainerComponent {
  @Input() field: FieldConfig | null = null;
  @Input() form!: FormGroup;
  @Output() fieldChange = new EventEmitter<any>();
}
