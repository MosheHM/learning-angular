import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-text-input',
  imports: [],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss'
})
export class TextInput {
  @Input() placeholder: string = '';
  value = signal('');
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.valueChange.emit(this.value());
  }
}
