import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DataService } from '../../services/data.service';
import { FieldConfig, EntityData } from '../../types/page.types';
import { DisplayTextComponent } from '../display-text/display-text';

@Component({
  selector: 'app-grid',
  imports: [DisplayTextComponent],
  templateUrl: './grid.html',
  styleUrl: './grid.scss'
})
export class Grid implements OnInit {
  gridFields: FieldConfig[] = [];
  entityData: EntityData = {};
  currentPageId: string = '';
  currentEntityId: string = '1'; // Example entity ID, replace as needed

  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentPageId = params['section'];
      this.loadGridData(this.currentPageId);
    });
  }

  private loadGridData(pageId: string): void {
    forkJoin({
      pageConfig: this.dataService.getPageById(pageId),
      pageData: this.dataService.getPageData(pageId, this.currentEntityId)
    }).subscribe({
      next: ({ pageConfig, pageData }) => {
        this.gridFields = this.sortFieldsByGridOrder(pageConfig.formFields);
        this.entityData = pageData;
      },
      error: (err) => {
        console.error('Error loading grid data:', err);
      }
    });
  }

  private sortFieldsByGridOrder(fields: FieldConfig[]): FieldConfig[] {
    return fields.sort((a, b) => 
      (a.layout?.gridLayout?.order || 0) - (b.layout?.gridLayout?.order || 0)
    );
  }

  getFieldValue(fieldName: string): any {
    return this.entityData[fieldName];
  }
}