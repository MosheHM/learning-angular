import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FieldConfig } from '../../types/page.types';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './number-input.html',
  styleUrls: ['./number-input.scss']
})
export class NumberInputComponent implements OnInit {
  @Input() field: FieldConfig | null = null;
  @Input() form!: FormGroup;
  @Input() parent: any;
  @Output() valueChange = new EventEmitter<number>();

  formControl!: FormControl;

  ngOnInit() {
    if (this.field && this.form) {
      this.formControl = this.form.get(this.field.name) as FormControl;
      if (!this.formControl) {
        console.error(`FormControl for ${this.field.name} not found in parent form group.`);
      }
    }
  }

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
    this.valueChange.emit(numValue as number);
  }
}