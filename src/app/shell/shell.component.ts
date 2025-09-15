import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageForm } from '../component/page-form/page-form';
import { SideBarMenu } from '../side-bar-menu/side-bar-menu';
import { Grid } from '../component/grid/grid';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, PageForm, SideBarMenu, Grid],
  template: `
    <div class="app-shell">
        <app-side-bar-menu></app-side-bar-menu>
        <div class="page-container">
          <app-page></app-page>
          <app-grid></app-grid>
        </div>
    </div>
  `,
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
}