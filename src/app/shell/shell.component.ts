import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../component/page/page';
import { SideBarMenu } from '../side-bar-menu/side-bar-menu';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, Page, SideBarMenu],
  template: `
    <div class="app-shell">
        <app-side-bar-menu></app-side-bar-menu>
        <div class="page-container">
          <app-page></app-page>
        </div>
    </div>
  `,
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
}