import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FieldsSection } from "../fields-section/fields-section";
import { Observable, map } from 'rxjs';
import { DataService } from '../../services/data.service';
import { FieldConfig } from '../field-container/field-container.component';

@Component({
  selector: 'app-page',
  imports: [FieldsSection, AsyncPipe],
  templateUrl: './page.html',
  styleUrl: './page.scss'
})
export class Page implements OnInit {
  leftSectionFields$!: Observable<FieldConfig[]>;
  rightSectionFields$!: Observable<FieldConfig[]>;
  loading = false;
  error: string | null = null;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const pageId = params['section'] || 'orders';
      this.loadFormFields(pageId);
    });
  }

  loadFormFields(pageId: string): void {
    this.loading = true;
    this.error = null;

    this.leftSectionFields$ = this.dataService.getFormFieldsByPageId<FieldConfig>(pageId)
      .pipe(
        map(fields => fields
          .filter(field => field.layout?.sectionId === "leftSection")
          .sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0))
        )
      );

    this.rightSectionFields$ = this.dataService.getFormFieldsByPageId<FieldConfig>(pageId)
      .pipe(
        map(fields => fields
          .filter(field => field.layout?.sectionId === "rightSection")
          .sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0))
        )
      );

    this.leftSectionFields$.subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }
}
