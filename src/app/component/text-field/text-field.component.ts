import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="field-container">
      <label [for]="getFieldId()" class="field-label">
        {{ field?.label }}
        @if (isRequired()) {
          <span class="required-indicator">*</span>
        }
      </label>

      <input
        type="text"
        [id]="getFieldId()"
        [name]="getFieldId()"
        [value]="getFieldValue()"
        [placeholder]="getPlaceholderText()"
        [required]="isRequired()"
        (input)="onFieldChange($event)"
        class="field-input"
        [class.field-input--error]="getFieldError()"
      />

      @if (getFieldError()) {
        <div class="field-error">
          {{ getFieldError() }}
        </div>
      }
    </div>
  `,
  styleUrls: ['../fields-outlet/fields-outlet.scss']
})
export class TextFieldComponent extends BaseFieldComponent {
}