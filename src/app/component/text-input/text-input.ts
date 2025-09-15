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
  @Output() valueChange = new EventEmitter<string>();

  formControl!: FormControl;

  ngOnInit() {
    if (this.field && this.form) {
      this.formControl = this.form.get(this.field.name) as FormControl;
    }
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}