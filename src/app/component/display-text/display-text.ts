import { Component, Input } from '@angular/core';
import { FieldValue } from '../../types/page.types';

@Component({
  selector: 'app-display-text',
  templateUrl: './display-text.html',
  styleUrl: './display-text.scss'
})
export class DisplayTextComponent {
  @Input({ required: false }) label!: string;
  @Input() value!: FieldValue | null;
  @Input() toolTipText?: string;
}