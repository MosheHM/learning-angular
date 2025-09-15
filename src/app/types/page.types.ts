export interface PageFormConfig {
  formFields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  label: string;
  layout?: {
    formLayout?: {
      sectionId?: string;
      order?: number;
    },
    gridLayout?: {
      order?: number;
    }
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

export type FieldValue = number | string;
export interface Field {
    name: string;
    value: FieldValue | null;
}

export interface PageData {
    fields: Field[];
};

export type EntityData = Record<string, FieldValue | null>;

export interface PageUpdateRequest {
  formFields?: FieldConfig[];
}

