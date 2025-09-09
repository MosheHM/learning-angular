import { Component, Input, Output, EventEmitter, ViewContainerRef, ViewChild, OnChanges, SimpleChanges, ComponentRef, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldLogicService } from '../../services/field-logic.service';
import { TextFieldComponent } from '../text-field/text-field.component';
import { NumberFieldComponent } from '../number-field/number-field.component';
import { EmailFieldComponent } from '../email-field/email-field.component';
import { TelFieldComponent } from '../tel-field/tel-field.component';
import { BaseFieldComponent } from '../base-field/base-field.component';

export interface FieldConfig {
    name: string;
    label: string;
    layout: {
        sectionId: string;
        order: number;
    };
    input: {
        dataType: 'text' | 'number';
        validation?: {
            required?: boolean;
            maxSize?: number;
            minLength?: number;
            pattern?: string;
        };
    };
    toolTipText?: string;
    placeholder?: string;
    options?: { value: string; label: string }[];
}

export interface FieldValue {
    [key: string]: any;
}

@Component({
    selector: 'app-field-container',
    imports: [CommonModule],
    templateUrl: './field-container.html',
    styleUrls: ['./field-container.scss']
})
export class FieldContainer implements OnChanges, AfterViewInit {
    @Input() field: FieldConfig | null = null;
    @Input() title?: string = '';
    @Output() formSubmit = new EventEmitter<any>();
    @Output() fieldChange = new EventEmitter<any>();

    @ViewChild('fieldContainer', { read: ViewContainerRef }) fieldContainer!: ViewContainerRef;

    private fieldLogicService = inject(FieldLogicService);
    private currentFieldComponent: ComponentRef<BaseFieldComponent> | null = null;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['field'] && this.fieldContainer) {
            this.renderField();
        }
    }

    ngAfterViewInit(): void {
        this.renderField();
    }

    private renderField(): void {
        // Clear previous component
        if (this.currentFieldComponent) {
            this.currentFieldComponent.destroy();
            this.currentFieldComponent = null;
        }

        if (!this.field || !this.fieldContainer) return;

        // Get component type based on field type
        const componentType = this.getComponentType(this.field.input.dataType);
        if (!componentType) return;

        // Create component programmatically
        this.currentFieldComponent = this.fieldContainer.createComponent(componentType);

        // Set inputs
        this.currentFieldComponent.instance.field = this.field;

        // Subscribe to field changes
        this.currentFieldComponent.instance.fieldChange.subscribe((value: any) => {
            this.fieldChange.emit(value);
        });
    }

    private getComponentType(dataType: string): any {
        switch (dataType) {
            case 'text':
                return TextFieldComponent;
            case 'number':
                return NumberFieldComponent;
            case 'email':
                return EmailFieldComponent;
            case 'tel':
                return TelFieldComponent;
            default:
                return TextFieldComponent; // Fallback to text field
        }
    }
}