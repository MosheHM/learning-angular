import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldContainerComponent, FieldConfig } from '../field-container/field-container.component';


@Component({
  selector: 'app-fields-section',
  imports: [CommonModule, FieldContainerComponent],
  templateUrl: './fields-section.html',
  styleUrl: './fields-section.scss',
})
export class FieldsSection {

  @Input() fields: FieldConfig[] = [];
  
}
