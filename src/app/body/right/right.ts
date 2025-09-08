import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { map, Observable } from 'rxjs';
import { FieldsOutletComponent, FieldConfig } from '../../component/fields-outlet/fields-outlet';

@Component({
  selector: 'app-right',
  imports: [CommonModule, FieldsOutletComponent],
  templateUrl: './right.html',
  styleUrl: './right.scss'
})
export class Right implements OnInit {
  formFields$!: Observable<any[]>;
  loading = false;
  error: string | null = null;

  // Demo fields for the four new field types
  textField: FieldConfig = {
    name: 'demo-text',
    label: 'Full Name',
    input: {
      dataType: 'text',
      validation: {
        required: true,
        minLength: 2,
        maxSize: 50
      }
    },
    toolTipText: 'Enter your full name'
  };

  numberField: FieldConfig = {
    name: 'demo-number',
    label: 'Age',
    input: {
      dataType: 'number',
      validation: {
        required: true
      }
    },
    toolTipText: 'Enter your age'
  };

  emailField: FieldConfig = {
    name: 'demo-email',
    label: 'Email Address',
    input: {
      dataType: 'email',
      validation: {
        required: true,
        minLength: 5,
        maxSize: 100
      }
    },
    toolTipText: 'Enter your email address'
  };

  telField: FieldConfig = {
    name: 'demo-tel',
    label: 'Phone Number',
    input: {
      dataType: 'tel',
      validation: {
        required: true
      }
    },
    toolTipText: 'Enter your phone number'
  };

  currentDemoField: FieldConfig = this.textField;
  currentFieldType: string = 'text';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadFormFields();
  }
  
  loadFormFields(): void {
    this.loading = true;
    this.error = null;

    this.formFields$ = this.dataService.getFormFields()
      .pipe(map(fields => fields.filter(field => field.layout.sectionId === "rightSection")
        .sort((a, b) => a.layout.order - b.layout.order)
      ));

    // Subscribe only once to handle loading states
    this.formFields$.subscribe({
      next: () => this.loading = false,
      error: (err) => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }

  refreshData(): void {
    this.loadFormFields();
  }

  // Handle demo field events
  onDemoFieldSubmit(value: any): void {
    console.log('Demo field submitted:', value);
    alert(`${this.currentDemoField.label} submitted with value: ${value}`);
  }

  onDemoFieldChange(value: any): void {
    console.log('Demo field changed:', value);
  }

  // Switch between different field types
  switchFieldType(type: string): void {
    this.currentFieldType = type;
    switch (type) {
      case 'text':
        this.currentDemoField = this.textField;
        break;
      case 'number':
        this.currentDemoField = this.numberField;
        break;
      case 'email':
        this.currentDemoField = this.emailField;
        break;
      case 'tel':
        this.currentDemoField = this.telField;
        break;
      default:
        this.currentDemoField = this.textField;
    }
  }
}
