import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-left',
  imports: [CommonModule],
  templateUrl: './left.html',
  styleUrl: './left.scss'
})
export class Left implements OnInit {
  formFields$!: Observable<any[]>;
  loading = false;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadFormFields();
  }

  loadFormFields(): void {
    this.loading = true;
    this.error = null;
    
    this.formFields$ = this.dataService.getFormFields()
      .pipe(
        map(fields => fields
          .filter(field => field.layout.sectionId === "leftSection")
          .sort((a, b) => a.layout.order - b.layout.order)
        )
      );


    // Handle loading and error states
    this.formFields$.subscribe({
      next: () => {
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
}
