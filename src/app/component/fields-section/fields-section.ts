import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { FieldContainerComponent } from '../field-container/field-container.component';
import { FieldConfig } from '../../types/page.types';

@Component({
  selector: 'app-fields-section',
  imports: [CommonModule, FieldContainerComponent],
  templateUrl: './fields-section.html',
  styleUrl: './fields-section.scss',
})
export class FieldsSection {
  @Input() fields: FieldConfig[] = [];
  @Input() form!: FormGroup;
  @Input() parent: any;
}
