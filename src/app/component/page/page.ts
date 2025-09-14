import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, FormControl, FormControlState } from '@angular/forms';
import { FieldsSection } from "../fields-section/fields-section";
import { SubmitButtonComponent } from '../submit-button/submit-button';
import { Observable, map, of, forkJoin } from 'rxjs';
import { DataService } from '../../services/data.service';
import { FieldConfig, PageFormConfig, fieldValue, Field, FieldsPageDataForm } from '../../types/page.types';

@Component({
  selector: 'app-page',
  imports: [FieldsSection, AsyncPipe, ReactiveFormsModule, SubmitButtonComponent],
  templateUrl: './page.html',
  styleUrl: './page.scss'
})
export class Page implements OnInit {
  pageForm!: FormGroup<Record<string, FormControl<fieldValue | null>>>;
  leftSectionFields$!: Observable<FieldConfig[]>;
  rightSectionFields$!: Observable<FieldConfig[]>;
  loading = false;
  submitting = false;
  error: string | null = null;
  pageConfig: PageFormConfig | null = null;
  pageData: Field[] | null = null;
  currentPageId: string = '';
  currentEntityId: string = '1'; // Example entity ID, replace as needed

  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.currentPageId = params['section'] || 'orders';
        this.loadPageData(this.currentPageId);
      });
  }

  private loadPageData(pageId: string): void {
    this.loading = true;
    this.error = null;
    
    forkJoin({
      pageConfig: this.dataService.getPageById(pageId),
      pageData: this.dataService.getPageData(pageId, this.currentEntityId)
    }).subscribe({
      next: ({ pageConfig, pageData }) => {
        this.pageConfig = pageConfig;
        this.pageData = pageData;
        this.setupFieldSections(pageConfig.formFields);
        this.buildPageFormFromServerData(pageData);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }

  private buildPageFormFromServerData(pageFields: FieldsPageDataForm): void {
    const formGroupConfig: Record<string, [fieldValue | null, ValidatorFn[]]> = {};

    Object.entries(pageFields).forEach(([name, value]) => {
      const fieldConfig = this.pageConfig?.formFields.find(f => f.name === name);
      if (!fieldConfig) return;
      const controlConfig = this.createFormControlConfig(value!, fieldConfig);
      formGroupConfig[name] = controlConfig;
    });

    this.pageForm = this.formBuilder.group(formGroupConfig);
  }

  private createFormControlConfig(fieldValue: fieldValue, fieldConfig: FieldConfig): [fieldValue | null, ValidatorFn[]] {
    const validators = this.buildValidators(fieldConfig);
    const initialValue = fieldValue || '';

    return [initialValue, validators];
  }

  private buildValidators(field: FieldConfig): ValidatorFn[] {
    const validators = [];

    if (field.input.validation?.required) {
      validators.push(Validators.required);
    }

    if (field.input.validation?.minLength) {
      validators.push(Validators.minLength(field.input.validation.minLength));
    }

    if (field.input.validation?.pattern) {
      validators.push(Validators.pattern(field.input.validation.pattern));
    }

    return validators;
  }

  private setupFieldSections(fields: FieldConfig[]): void {
    this.leftSectionFields$ = of(fields).pipe(
      map(fields => fields
        .filter(field => field.layout?.sectionId === "leftSection")
        .sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0))
      )
    );

    this.rightSectionFields$ = of(fields).pipe(
      map(fields => fields
        .filter(field => field.layout?.sectionId === "rightSection")
        .sort((a, b) => (a.layout?.order || 0) - (b.layout?.order || 0))
      )
    );
  }
  onSubmit(): void {
    if (this.pageForm.valid && this.pageConfig) {
      this.submitting = true;
      this.error = null;

      const rawFormData = this.pageForm.value;
      const formData = { ...rawFormData, id: this.currentEntityId };

      this.dataService.updatePageData(this.currentPageId, formData)
        .subscribe({
          next: (response) => {
            this.submitting = false;
  
          },
          error: (err) => {
            this.submitting = false;
            this.error = err.message;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.pageForm.controls).forEach(key => {
      const control = this.pageForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.pageForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

}
