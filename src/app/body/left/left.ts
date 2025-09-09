import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { map, Observable } from 'rxjs';
import { FieldContainer, FieldConfig } from '../../component/field-container/field-container';

@Component({
  selector: 'app-left',
  imports: [CommonModule, FieldContainer],
  templateUrl: './left.html',
  styleUrl: './left.scss'
})
export class Left implements OnInit {
  formFields$!: Observable<FieldConfig[]>;
  loading = false;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadFormFields();
  }

  loadFormFields(): void {
    this.loading = true;
    this.error = null;
    
    this.formFields$ = this.dataService.getFormFields<FieldConfig>()
      .pipe(
        map(fields => fields
          .filter(field => field.layout.sectionId === "leftSection")
          .sort((a, b) => a.layout.order - b.layout.order)
        )
      );


    // Handle loading and error states
    this.formFields$.subscribe({
      next: (fields) => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }

  refreshData(): void {
    this.loadFormFields();
  }

  onDemoFieldSubmit(value: FieldConfig): void {
    console.log('Demo field submitted:', value);
    alert(`${value.label} submitted with value: ${value}`);
  }

  onDemoFieldChange(value: FieldConfig): void {
    console.log('Demo field changed:', value);
  }
}
