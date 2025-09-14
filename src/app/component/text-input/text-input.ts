import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { FieldConfig } from '../../types/page.types';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrls: ['./text-input.scss']
})
export class TextInputComponent implements OnInit {
  @Input() field: FieldConfig | null = null;
  @Input() form!: FormGroup;
  @Input() parent: any;
  @Output() valueChange = new EventEmitter<string>();

  formControl!: FormControl;

  ngOnInit() {
    if (this.field && this.form) {
      this.formControl = this.form.get(this.field.name) as FormControl;
    }
  }

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
    this.valueChange.emit(value);
  }
}