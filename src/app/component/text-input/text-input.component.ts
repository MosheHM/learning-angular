import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldConfig } from '../../component/field-container/field-container.component';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent{
  @Input() field: FieldConfig | null = null;
  @Output() valueChange = new EventEmitter<string>();
  
  value: string = '';
  disabled: boolean = false;
  
  private onChange = (_: any) => {};
  onTouched = () => {};

  get isRequired(): boolean {
    return !!this.field?.input.validation?.required;
  }

  get minLength(): number | undefined {
    return this.field?.input.validation?.minLength;
  }

  get pattern(): string | undefined {
    return this.field?.input.validation?.pattern;
  }

  get placeholder(): string {
    return this.field?.placeholder || '';
  }

  get label(): string {
    return this.field?.label || '';
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

}