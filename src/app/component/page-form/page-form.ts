import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { FieldsSection } from "../fields-section/fields-section";
import { SubmitButtonComponent } from '../submit-button/submit-button';
import { forkJoin } from 'rxjs';
import { DataService } from '../../services/data.service';
import { FieldConfig, FieldValue, EntityData } from '../../types/page.types';

@Component({
  selector: 'app-page',
  imports: [FieldsSection, ReactiveFormsModule, SubmitButtonComponent],
  templateUrl: './page-form.html',
  styleUrl: './page-form.scss'
})
export class PageForm implements OnInit {
  pageForm!: FormGroup<Record<string, FormControl<FieldValue | null>>>;
  leftSectionFields: FieldConfig[] = [];
  rightSectionFields: FieldConfig[] = [];
  currentPageId: string = '';
  currentEntityId: string = '1'; // Example entity ID, replace as needed

  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentPageId = params['section'];
      this.loadPageData(this.currentPageId);
    });
  }

  private async loadPageData(pageId: string): Promise<void> {
    
    const [pageConfig, pageData] = await Promise.all([
        this.dataService.getPageById(pageId),
        this.dataService.getPageData(pageId, this.currentEntityId)
      ]);

      this.splitToSections(pageConfig.formFields);
      this.buildPageFormFromServerData(pageData, pageConfig.formFields);
  }

  private buildPageFormFromServerData(pageFields: EntityData, fieldsConfig: FieldConfig[]): void {
    const formGroupConfig: Record<string, [FieldValue | null, ValidatorFn[]]> = fieldsConfig.reduce((acc, fieldConfig) => {
      const fieldValue = pageFields[fieldConfig.name];
      const controlConfig = this.createFormControlConfig(fieldConfig, fieldValue);
      acc[fieldConfig.name] = controlConfig;
      return acc;
    }, {} as Record<string, [FieldValue | null, ValidatorFn[]]>);

    this.pageForm = this.formBuilder.group(formGroupConfig);
  }

  private createFormControlConfig(fieldConfig: FieldConfig, fieldValue: FieldValue | null): [FieldValue | null, ValidatorFn[]] {
    const validators = this.buildValidators(fieldConfig);
    const initialValue = fieldValue || fieldConfig.placeholder || '';

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

  private splitToSections(fields: FieldConfig[]): void {
    this.leftSectionFields = fields
      .filter(field => field.layout?.formLayout?.sectionId === "leftSection")
      .sort((a, b) => (a.layout?.formLayout?.order || 0) - (b.layout?.formLayout?.order || 0));

    this.rightSectionFields = fields
      .filter(field => field.layout?.formLayout?.sectionId === "rightSection")
      .sort((a, b) => (a.layout?.formLayout?.order || 0) - (b.layout?.formLayout?.order || 0));
  }

  onSubmit(): void {
    if (this.pageForm.valid) {

      const rawFormData = this.pageForm.value;
      const formData = { ...rawFormData, id: this.currentEntityId };

      this.dataService.updatePageData("somePageId", formData)
        
    } else {
      this.pageForm.markAsTouched();
    }
  }

}
