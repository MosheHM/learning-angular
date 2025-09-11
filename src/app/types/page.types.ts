export interface PageFormConfig {
  formFields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  label: string;
  layout?: {
    sectionId?: string;
    order?: number;
  };
  input: {
    dataType: string;
    validation?: {
      required?: boolean;
      maxSize?: number;
      minLength?: number;
      pattern?: string;
    };
  };
  toolTipText?: string;
  placeholder?: string;
}

export interface FormSubmission {
  pageId: string;
  formData: Record<string, any>;
  submittedAt: Date;
  submittedBy?: string;
}

export type fieldValue = number | string;
export interface Field {
    name: string;
    value: fieldValue | null;
}

export interface PageData {
    fields: Field[];
};

export type FieldsPageDataForm = Record<string, fieldValue | null>;

export interface PageUpdateRequest {
  formFields?: FieldConfig[];
}

