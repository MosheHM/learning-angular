import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldConfig } from '../../component/field-container/field-container.component';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss']
})
export class NumberInputComponent {
  @Input() field: FieldConfig | null = null;
  @Output() valueChange = new EventEmitter<number>();
  
  value: number | null = null;
  disabled: boolean = false;
  onChange = (_: any) => {};
  onTouched = () => {};

  get isRequired(): boolean {
    return !!this.field?.input.validation?.required;
  }

  get maxSize(): number | undefined {
    return this.field?.input.validation?.maxSize;
  }

  get placeholder(): string {
    return this.field?.placeholder || '';
  }

  get label(): string {
    return this.field?.label || '';
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const numValue = inputValue ? parseFloat(inputValue) : null;
    
    this.value = numValue;
    this.onChange(numValue);
    this.valueChange.emit(numValue as number);
  }
}